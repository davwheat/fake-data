import app from 'flarum/app';
import ExtensionPage from 'flarum/components/ExtensionPage';
import Button from 'flarum/components/Button';
import Switch from 'flarum/components/Switch';

/* global m */

const translationPrefix = 'migratetoflarum-fake-data.admin.generator.';

export default class FakeDataExtensionSettingsPage extends ExtensionPage {
    bulk = false;
    userCount = 0;
    discussionCount = 0;
    postCount = 0;
    dirty = false;
    loading = false;

    content() {
        return m('div.container[style=margin-top:16px]', [
            m('.Form-group', [
                Switch.component({
                    state: this.bulk,
                    onchange: value => {
                        this.bulk = value;
                    },
                }, app.translator.trans(translationPrefix + 'bulk-mode')),
                m('.helpText', app.translator.trans(translationPrefix + 'bulk-mode-description')),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'user-count')),
                m('input.FormControl', {
                    type: 'number',
                    min: '0',
                    value: this.userCount + '',
                    oninput: event => {
                        this.userCount = parseInt(event.target.value);
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'discussion-count')),
                m('input.FormControl', {
                    type: 'number',
                    min: '0',
                    value: this.discussionCount + '',
                    oninput: event => {
                        this.discussionCount = parseInt(event.target.value);
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'post-count')),
                m('input.FormControl', {
                    type: 'number',
                    min: '0',
                    value: this.postCount + '',
                    oninput: event => {
                        this.postCount = parseInt(event.target.value);
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                Button.component({
                    disabled: !this.dirty,
                    loading: this.loading,
                    className: 'Button Button--primary',
                    onclick: () => {
                        this.loading = true;

                        app.request({
                            url: app.forum.attribute('apiUrl') + '/fake-data',
                            method: 'POST',
                            body: {
                                bulk: this.bulk,
                                user_count: this.userCount,
                                discussion_count: this.discussionCount,
                                post_count: this.postCount,
                            },
                        }).then(() => {
                            this.userCount = 0;
                            this.discussionCount = 0;
                            this.postCount = 0;
                            this.dirty = false;
                            this.loading = false;

                            m.redraw();
                        }).catch(e => {
                            this.loading = false;
                            m.redraw();
                            throw e;
                        });
                    },
                }, app.translator.trans(translationPrefix + 'send')),
            ]),
        ]);
    }
}
