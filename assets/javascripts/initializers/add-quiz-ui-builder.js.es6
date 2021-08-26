import discourseComputed from "discourse-common/utils/decorators";
import showModal from "discourse/lib/show-modal";
import { withPluginApi } from "discourse/lib/plugin-api";

function initializeQuizUIBuilder(api) {
  api.modifyClass("controller:composer", {
    @discourseComputed("siteSettings.discourse_quiz_enabled")
    canBuildQuiz(discourseQuizEnabled) {
      return discourseQuizEnabled;
    },

    actions: {
      showQuizBuilder() {
        showModal("poll-ui-builder").set("toolbarEvent", this.toolbarEvent);
      },
    },
  });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: "showQuizBuilder",
      icon: "list-ul",
      label: "discourse_quiz.ui_builder.title",
      condition: "canBuildQuiz",
    };
  });
}

export default {
  name: "add-quiz-ui-builder",

  initialize() {
    withPluginApi("0.8.7", initializeQuizUIBuilder);
  },
};