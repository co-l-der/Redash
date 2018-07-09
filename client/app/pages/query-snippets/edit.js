import 'brace/mode/snippets';
import template from './edit.html';

function SnippetCtrl($routeParams, $http, $location, toastr, currentUser, Events, QuerySnippet) {
  this.snippetId = $routeParams.snippetId;
  Events.record('view', 'query_snippet', this.snippetId);

  this.editorOptions = {
    mode: 'snippets',
    advanced: {
      behavioursEnabled: true,
      enableSnippets: false,
      autoScrollEditorIntoView: true,
    },
    onLoad(editor) {
      editor.$blockScrolling = Infinity;
      editor.getSession().setUseWrapMode(true);
      editor.setShowPrintMargin(false);
    },
  };

  this.saveChanges = () => {
    this.snippet.$save((snippet) => {
      toastr.success('保存');
      if (this.snippetId === 'new') {
        $location.path(`/query_snippets/${snippet.id}`).replace();
      }
    }, () => {
      toastr.error('保存查询片段失败。');
    });
  };

  this.delete = () => {
    this.snippet.$delete(() => {
      $location.path('/query_snippets');
      toastr.sucess('查询片段已删除。');
    }, () => {
      toastr.error('删除查询片段失败。');
    });
  };

  if (this.snippetId === 'new') {
    this.snippet = new QuerySnippet({ description: '' });
    this.canEdit = true;
  } else {
    this.snippet = QuerySnippet.get({ id: this.snippetId }, (snippet) => {
      this.canEdit = currentUser.canEdit(snippet);
    });
  }
}

export default function init(ngModule) {
  ngModule.component('snippetPage', {
    template,
    controller: SnippetCtrl,
  });

  return {
    '/query_snippets/:snippetId': {
      template: '<snippet-page></snippet-page>',
      title: 'Query Snippet',
    },
  };
}
