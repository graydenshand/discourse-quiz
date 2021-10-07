import { createWidget } from "discourse/widgets/widget";
import hbs from "discourse/widgets/hbs-compiler";
import showModal from "discourse/lib/show-modal";

createWidget("discourse-quiz", {
  tagName: "div.quiz",

  buildKey: (attrs) => `discourse-quiz-${attrs.id}`,

  defaultState(attrs) {
    return {
      model: attrs.model,
    };
  },

  open() {
    return this.store
      .update("discourse-quiz-quiz", this.state.model.id, {
        is_open: true,
      })
      .then((resp) => {
        this.state.model = resp.responseJson.quiz;
      });
  },

  close() {
    return this.store
      .update("discourse-quiz-quiz", this.state.model.id, {
        is_open: false,
      })
      .then((resp) => {
        this.state.model = resp.responseJson.quiz;
      });
  },

  edit() {
    /*
      Open Quiz Builder modal, pre-filled with data from this quiz
    */
    this.store
      .find("discourse-quiz-question", { quiz_id: this.state.model.id })
      .then((resp) => {
        showModal("quiz-ui-builder").setProperties({
          questions: resp.content,
          activeQuestionIndex: 0,
        });
      });
  },

  template: hbs`
    <div class="quiz-preview">
      {{# if state.model}}
      <div class="quiz-preview-body">
        <div>
          <h2>
            {{d-icon "graduation-cap"}} 
              {{state.model.title}}
          </h2>
          <p class="quiz-info">
            {{{attrs.dates}}}
            Attempts: {{#if state.model.max_attempts state.model.max_attempts}}{{state.model.max_attempts}}{{else}}Unlimited{{/if}}<br>
            Time limit: {{attrs.formattedTimeLimit}}
          </p>
        </div>
        <div class="quiz-preview-right-side">
          <div>
            {{#if state.model.can_act_on_quiz}}
              {{attach 
                widget="quiz-options"
                attrs=(hash
                  model=state.model
                )
              }}
            {{/if}}
          </div>
          {{#unless state.model.is_open}}
            <span id="quiz-lock-icon">
              {{d-icon "lock"}}
            </span>
          {{/unless}}
        </div>
      </div>
      {{#if state.model.is_open}}
      <div class="quiz-preview-footer">
          {{attach widget="start-quiz-button"}}
          {{attach widget="quiz-results-button"}}
      </div>
      {{/if}}
    {{else}}
      <div>
        <div class="quiz-preview-body">
          <h2>{{d-icon "graduation-cap"}} {{i18n "discourse_quiz.widget.title"}}</h2>
        </div>
      </div>
    {{/if}}
  </div>
  `,
});