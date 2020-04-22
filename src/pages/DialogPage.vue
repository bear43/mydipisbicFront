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
      <div class="q-ma-md column items-center col-9">
        <q-virtual-scroll
          style="width: 100%; max-width: 40%; overflow-x: hidden"
          :items-size="messagesLocalTotal"
          :items-fn="getMessages"
          :virtual-scroll-item-size="48"
          @virtual-scroll="loadMoreMessages"
          separator
        >
          <template v-slot="{ item, index }">
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
          </template>
        </q-virtual-scroll>
        <!-- <div style="width: 100%; max-width: 400px" v-for="message in messages" :key="message.id">
          <q-chat-message
            v-if="message.user.id === currentUser.id"
            :name="message.user.lastName + ' ' + message.user.firstName + ' ' + message.user.secondName"
            :text="[message.content]"
            sent
          />
          <q-chat-message
            v-else
            :name="message.user.lastName + ' ' + message.user.firstName + ' ' + message.user.secondName"
            :text="[message.content]"
          />
        </div>-->
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
    </div>
    <q-dialog v-model="newDialogDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <q-input dense v-model="newDialogDialog.object.title" autofocus :hint="$t('label.title')" />
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
  </q-page>
</template>

<script>
import Roles from "../utils/roles";
import WS from "../utils/ws";
import roles from "../utils/roles";
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
      currentDialog: null
    };
  },
  methods: {
    onSend: function() {
      this.$store.dispatch('MessageStore/createMessage', {
        dialogId: this.currentDialog,
        content: this.text
      }).then(() => {
        this.text = "";
      });
    },
    loadDialogues: function() {
      this.$store.dispatch("DialogStore/loadDialogues");
    },
    loadMessages: function() {
      this.$store.dispatch("MessageStore/loadMessages", this.currentDialog);
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
          this.loadDialogues();
        });
    },
    getDialogues: function(from, size) {
      return this.dialogues;
    },
    getMessages: function(from, size) {
      return this.messages;
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
    loadMoreMessages: function(details) {
      if (details.index === details.to) {
        this.$store.dispatch("MessageStore/getTotal").then(() => {
          if (this.$store.getters["MessageStore/hasMessages"]) {
            this.$store.dispatch("MessageStore/evaluatePage");
            this.loadMessages();
          }
        });
      }
    },
    filterFn: function(val, update, abort) {
      const goSearch = val && val !== "";
      if (goSearch) {
        this.$store.dispatch("UserStore/loadUsersByString", val).then(users => {
          this.newDialogDialog.users = users;
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
    onDialogClick: function(dialogId) {
      this.currentDialog = dialogId;
      this.loadMessages();
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
    }
  },
  mounted() {
    this.loadDialogues();
    //WS.start("http://localhost:8080/ws");
  }
};
</script>