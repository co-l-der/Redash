function controller(clientConfig, currentUser) {
  this.showMailWarning = clientConfig.mailSettingsMissing && currentUser.isAdmin;
}

export default function init(ngModule) {
  ngModule.component('emailSettingsWarning', {
    bindings: {
      function: '<',
    },
    template: '<p class="alert alert-danger" ng-if="$ctrl.showMailWarning">您的邮件服务器未配置，请务必对邀请电子邮件进行配置！</p>',
    controller,
  });
}
