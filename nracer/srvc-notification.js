nracer.service("NotifService", function ($mdDialog) {
  var NotifService = this;
  
  NotifService.data = {
    available: false,
    subscription: null,
    registration: null
  };
  
  NotifService.subscribe = function (scope) {
    if (NotifService.data.registration) {
      NotifService.data.registration.pushManager.subscribe({userVisibleOnly: true})
      .then(function (subscription) {
        console.log('Subscription endpoint:', subscription.endpoint);
        
        scope.$apply(function () {
          NotifService.data.subscription = subscription;
        });
      })
      
      .catch(function (error) {  
        console.warn('Subscription Denied:', error);  
      });
    }
  };
  
  NotifService.unsubscribe = function (scope) {
    NotifService.data.subscription.unsubscribe()
    
    .then(function (successful) {  
      scope.$apply(function () {
        NotifService.data.subscription = null;
      });
    })
    
    .catch(function (error) {  
      // We failed to unsubscribe, this can lead to  
      // an unusual state, so may be best to remove
      // the users data from your data store and
      // inform the user that you have done so

      console.log('Unsubscription error: ', error);
      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Unsubscribe Error')
          .textContent('There was an error unsubscribing from notifications.')
          .ariaLabel('Unsubscribe Error')
          .ok('OK')
      );
    });
  };
  
  NotifService.get_subscription = function (scope) {
    NotifService.data.registration.pushManager.getSubscription()
    .then(function (subscription) {
      console.log('Subs:', subscription);
      
      if (subscription) {
        scope.$apply(function () {
          NotifService.data.subscription = subscription;
        });
      }
      
      else {
        scope.$apply(function () {
          NotifService.data.subscription = null;
        });
      }
    })
    
    .catch(function (error) {
      console.warn('Error getting subscription.');
    });
  };
  
  return NotifService;
});
