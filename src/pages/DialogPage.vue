<template>
  <q-page>
    <div class="q-ma-md row">
      <div class="q-pa-md col-3" style="max-width: 350px">
        <q-list bordered separator v-for="dialog in dialogues" :key="dialog.id">
          <q-item clickable v-ripple>
            <q-item-section>
              <!-- <q-item-label overline>{{dialog.title}}</q-item-label>
              <q-item-label>{{dialog.lastMessage}}</q-item-label>-->
              <q-item-label>{{dialog.title}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn @click="newDialog()">Новый диалог</q-btn>
      </div>
      <div class="q-ma-md column items-center col-9">
        <div style="width: 100%; max-width: 400px" v-for="message in messages" :key="message.id">
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
    </div>
    <q-dialog v-model="newDialogDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <q-input dense v-model="newDialogDialog.title" autofocus @keyup.enter="addNewDialog()" />
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
      nextId: 0,
      messages: [],
      newDialogDialog: {
        show: false,
        title: ""
      }
    };
  },
  methods: {
    onSend: function() {
      this.messages.push({
        id: this.nextId,
        user: this.currentUser,
        content: this.text
      });
      this.text = "";
      this.nextId++;
    },
    loadDialogues: function() {
      this.$store.dispatch("DialogStore/loadDialogues");
    },
    newDialog: function() {
      this.newDialogDialog.show = true;
    },
    addNewDialog: function() {
      this.$store
        .dispatch("DialogStore/createDialog", this.newDialogDialog.title)
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
    }
  },
  mounted() {
    this.loadDialogues();
    WS.start("http://localhost:8080/ws");
  }
};
</script>