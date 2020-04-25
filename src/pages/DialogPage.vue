<template>
  <q-page>
    <div class="row">
      <div class="q-pa-md col-2">
        <q-virtual-scroll
          style="max-height: 50%; overflow-x: hidden"
          :items-size="dialoguesLocalTotal"
          :items-fn="getDialogues"
          :virtual-scroll-item-size="48"
          @virtual-scroll="loadMoreDialogues"
          separator
        >
          <template v-slot="{ item, index }">
            <q-item clickable v-ripple :key="index" @click="onDialogClick(item.id)">
              <q-item-section>
                <q-item-label>{{item.title}}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-virtual-scroll>
        <div class="row justify-center">
          <q-btn class="q-ma-md" @click="newDialog()">Новый диалог</q-btn>
        </div>
      </div>
      <div class="q-ma-md column items-center col-7">
        <div
          ref="scrollTarget"
          class="q-pa-md"
          style="max-height: 50vh; overflow: auto; width: 100%"
        >
          <q-infinite-scroll
            @load="loadMoreMessages"
            :scroll-target="$refs.scrollTarget"
            reverse
            :offset="500"
            ref="messageScroll"
          >
            <template slot="loading">
              <div class="row justify-center q-my-md">
                <q-spinner color="primary" name="dots" size="40px" />
              </div>
            </template>

            <div v-for="(item, index) in getMessages()" :key="index" class="caption q-py-sm">
              <q-chat-message
                v-if="item.author.id === currentUser.id"
                :name="item.author.lastName + ' ' + item.author.firstName + ' ' + item.author.secondName"
                :text="[item.content]"
                :key="index"
                sent
              />
              <q-chat-message
                v-else
                :name="item.author.lastName + ' ' + item.author.firstName + ' ' + item.author.secondName"
                :text="[item.content]"
                :key="index"
              />
            </div>
          </q-infinite-scroll>
        </div>
        <div class="q-ma-md column items-center" style="width: 80%">
          <q-input
            style="width: 100%"
            v-model="text"
            filled
            type="textarea"
            @keydown.enter="onSend()"
          />
          <q-btn class="q-mt-md" @click="onSend()">Send</q-btn>
        </div>
      </div>
      <div class="q-ma-md col-2">
        <div style="max-height: 50vh; overflow: auto; width: 100%">
          <q-list v-for="recipient in recipients" :key="recipient.id">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>{{recipient.lastName + ' ' + recipient.firstName + ' ' + recipient.secondName + '. Логин: ' + recipient.login}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn v-if="currentUser.id !== recipient.id && currentDialogObj.author.id === currentUser.id" icon="delete" @click="onDeleteRecipient(recipient)"></q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="row justify-center">
          <q-btn v-if="currentDialogObj && currentDialogObj.author && currentDialogObj.author.id === currentUser.id" class="q-ma-md" @click="addRecipient()">Добавить участника</q-btn>
        </div>
      </div>
    </div>
    <q-dialog v-model="newDialogDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <q-input
            dense
            v-model="newDialogDialog.object.title"
            autofocus
            :hint="$t('label.title')"
          />
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="newDialogDialog.object.recipients"
            clearable
            multiple
            use-input
            :options="newDialogDialog.users"
            @filter="filterFn"
            @filter-abort="abortFilterFn"
            :option-label="item => item.lastName + ' ' + item.firstName + ' ' + item.secondName + '. Логин: ' + item.login"
            @input="onEnterUser"
            :hint="$t('label.recipients')"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">{{$t('label.noResult')}}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('label.cancel')" v-close-popup />
          <q-btn flat :label="$t('label.add')" @click="addNewDialog()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addRecipientDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <q-select
            filled
            v-model="addRecipientDialog.recipients"
            clearable
            multiple
            use-input
            :options="addRecipientDialog.users"
            @filter="filterFn"
            @filter-abort="abortFilterFn"
            :option-label="item => item.lastName + ' ' + item.firstName + ' ' + item.secondName + '. Логин: ' + item.login"
            @input="onEnterUser"
            :hint="$t('label.recipients')"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">{{$t('label.noResult')}}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('label.cancel')" v-close-popup />
          <q-btn flat :label="$t('label.add')" @click="addNewRecipients()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Roles from "../utils/roles";
import WS from "../utils/ws";
import roles from "../utils/roles";
import axios from "axios";

function WSConnection(store, intervalToStop) {
  if (!store.state["UserStore"].user.id) {
    let _intervalToStop = setInterval(() => {
      WSConnection(store, _intervalToStop);
    }, 100);
  } else {
    if (intervalToStop) {
      clearInterval(intervalToStop);
    }
    WS.start("http://localhost:8080/ws", roles.getToken()).then(() => {
      WS.subscribe("/user/topic/dialogues");
    });
  }
}

export default {
  name: "PageDialog",
  data: function() {
    return {
      text: "",
      newDialogDialog: {
        show: false,
        object: {
          id: null,
          title: "",
          recipients: []
        },
        currentUser: {},
        users: []
      },
      addRecipientDialog: {
        show: false,
        users: [],
        recipients: []
      },
      currentDialog: null,
      currentDialogMessagesSubscription: null,
      currentDialogSubscription: null,
      recipients: []
    };
  },
  methods: {
    onSend: function() {
      this.$store
        .dispatch("MessageStore/createMessage", {
          dialogId: this.currentDialog,
          content: this.text
        })
        .then(() => {
          this.text = "";
        });
    },
    loadDialogues: function() {
      this.$store.dispatch("DialogStore/loadDialogues");
    },
    loadMessages: async function() {
      return this.$store.dispatch(
        "MessageStore/loadMessages",
        this.currentDialog
      );
    },
    newDialog: function() {
      this.newDialogDialog.object = {
        id: null,
        title: "",
        recipients: []
      };
      this.newDialogDialog.show = true;
    },
    addNewDialog: function() {
      this.$store
        .dispatch("DialogStore/createDialog", this.newDialogDialog.object)
        .then(() => {
          this.newDialogDialog.title = "";
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: this.$t("notify.successful")
          });
          this.newDialogDialog.show = false;
        });
    },
    addNewRecipients: function() {
      axios.post("http://localhost:8080/dialogues/recipients/add", {
        id: this.currentDialog,
        recipientIds: this.addRecipientDialog.recipients.map(
          recipient => recipient.id
        )
      });
    },
    addRecipient: function() {
      this.addRecipientDialog.show = true;
    },
    getDialogues: function(from, size) {
      return this.dialogues;
    },
    getMessages: function() {
      return [...this.messages].reverse();
    },
    testify: function(d) {
      console.log(d);
      return d;
    },
    loadMoreDialogues: function(details) {
      if (details.index === details.to) {
        this.$store.dispatch("DialogStore/getTotal").then(() => {
          if (this.$store.getters["DialogStore/hasDialogues"]) {
            this.$store.dispatch("DialogStore/evaluatePage");
            this.loadDialogues();
          }
        });
      }
    },
    loadMoreMessages: function(index, done) {
      this.$store
        .dispatch("MessageStore/getTotal", this.currentDialog)
        .then(() => {
          if (this.$store.getters["MessageStore/hasMessages"]) {
            this.$store.dispatch("MessageStore/evaluatePage");
            this.loadMessages().then(() => {
              done();
            });
          } else {
            done(true);
          }
        });
    },
    filterFn: function(val, update, abort) {
      const goSearch = val && val !== "";
      if (goSearch) {
        this.$store.dispatch("UserStore/loadUsersByString", val).then(users => {
          this.newDialogDialog.users = users;
          this.addRecipientDialog.users = users;
          update();
        });
      } else {
        update();
      }
    },
    abortFilterFn: function() {
      // console.log('delayed filter aborted')
    },
    onEnterUser: function(user) {},
    onDeleteRecipient: function(recipient) {
      axios.post("http://localhost:8080/dialogues/recipients/remove", {
        id: this.currentDialog,
        recipientIds: [recipient.id]
      });
    },
    onAddRecipients: function(recipients) {
      axios.post("http://localhost:8080/dialogues/recipients/add", {
        id: this.currentDialog,
        recipientsIds: recipients.map(recipient => recipient.id)
      });
    },
    onDialogClick: function(dialogId) {
      dialogUnsubscription(this);
      this.currentDialog = dialogId;
      axios
        .get("http://localhost:8080/dialogues/recipients/get", {
          params: {
            dialogId: dialogId
          }
        })
        .then(response => {
          this.recipients = response.data;
        });
      this.$store.dispatch("MessageStore/resetMessages");
      this.loadMessages().then(() => {
        //this.$refs.scrollTarget.setScrollPosition(this.$refs.scrollTarget.$el.scrollHeight, 1);
        this.$refs.messageScroll.resume();
        this.$refs.messageScroll.reset();
        const objDiv = this.$refs.scrollTarget;
        objDiv.scrollTop = objDiv.scrollHeight;
        dialogSubscriptions(this, dialogId);
      });
    },
    createDialogHandler: function(dialog) {
      this.$store.dispatch("DialogStore/addDialog", dialog);
    },
    createMessageHandler: function(message) {
      this.$store.dispatch("MessageStore/addMessage", message);
      const interval = setInterval(() => {
        const objDiv = this.$refs.scrollTarget;
        objDiv.scrollTop = objDiv.scrollHeight;
        clearInterval(interval);
      }, 100);
    },
    addRecipientsHandler: function(form) {
      if (this.currentDialog === form.id) {
        this.recipients.push(...form.recipients);
        // this.recipients = this.recipients.filter(
        //   (recipient, index) => this.recipients.indexOf(recipient) === index
        // );
      }
    },
    deleteRecipientsHandler: function(form) {
      if (this.currentDialog === form.id) {
        let array = form.recipientIds.filter(
          recipient => recipient === this.currentUser.id
        );
        if (array.length > 0) {
          dialogUnsubscription(this);
          this.currentDialog = null;
          this.$store.dispatch("MessageStore/resetMessages");
          this.recipients = [];
        } else {
          let recipients = form.recipientIds;
          for (let index in recipients) {
            const rec = recipients[index];
            let recipientObj = this.recipients.filter(
              record => record.id === rec
            )[0];
            if (recipientObj) {
              let recipientIndex = this.recipients.indexOf(recipientObj);
              if (recipientIndex !== -1) {
                this.recipients.splice(recipientIndex, 1);
              }
            }
          }
        }
      }
    }
  },
  computed: {
    userRole: function() {
      return Roles.getUserRoles()[0];
    },
    currentUser: function() {
      return this.$store.state["UserStore"].user;
    },
    dialogues: function() {
      return this.$store.state["DialogStore"].dialogues;
    },
    dialoguesLocalTotal: function() {
      return this.$store.state["DialogStore"].dialogues.length;
    },
    dialoguesRemoteTotal: function() {
      return this.$store.state["DialogStore"].total;
    },
    messages: function() {
      return this.$store.state["MessageStore"].messages;
    },
    messagesLocalTotal: function() {
      return this.$store.state["MessageStore"].messages.length;
    },
    messagesRemoteTotal: function() {
      return this.$store.state["MessageStore"].total;
    },
    currentDialogObj: function() {
      return this.$store.state["DialogStore"].dialogues.filter(dialog => dialog.id === this.currentDialog)[0];
    }
  },
  mounted() {
    this.loadDialogues();
    WS.regHandler("CREATE_DIALOG", this.createDialogHandler);
    WS.regHandler("CREATE_MESSAGE", this.createMessageHandler);
    WS.regHandler("ADD_RECIPIENTS", this.addRecipientsHandler);
    WS.regHandler("DELETE_RECIPIENTS", this.deleteRecipientsHandler);
    WSConnection(this.$store);
  }
};

function unsubscribe(subscription) {
  if (subscription) {
    WS.unsubscribe(subscription);
    subscription = null;
  }
  return subscription;
}

function dialogUnsubscription(self) {
  self.currentDialogMessagesSubscription = unsubscribe(
    self.currentDialogMessagesSubscription
  );
  self.currentDialogSubscription = unsubscribe(self.currentDialogSubscription);
}

function dialogSubscriptions(self, dialogId) {
  self.currentDialogMessagesSubscription = WS.subscribe(
    "/topic/dialogues/" + dialogId + "/messages"
  );
  self.currentDialogSubscription = WS.subscribe("/topic/dialogues/" + dialogId);
}
</script>