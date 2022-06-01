"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var socketEvents = {};
socketEvents.NewUser = 'NewUser';
socketEvents.LogOut = 'LogOut';
socketEvents.NewSignup = 'NewSignup';
socketEvents.RemovePromoCode = 'RemovePromoCode';
socketEvents.Company = 'Company';
socketEvents.NewMessage = 'NewMessage';
socketEvents.NotificationsCount = 'NotificationsCount';
socketEvents.NotRatedTrips = 'NotRatedTrips';
socketEvents.NewLocation = 'NewLocation';
socketEvents.HelpCount = 'HelpCount';
socketEvents.Typing = 'Typing';
socketEvents.StopTyping = 'StopTyping';
socketEvents.UpdateLocation = 'UpdateLocation';
socketEvents.ChangeOrderStatus = 'ChangeOrderStatus';
socketEvents.NewMessageCount = 'NewMessageCount';
socketEvents.UpdateSeen = 'UpdateSeen';
socketEvents.UpdateOrderCount = 'UpdateOrderCount';
socketEvents.ContactUsCount = 'ContactUsCount';
socketEvents.NEWHELPMESSAGE = 'NEWHELPMESSAGE';
var _default = socketEvents;
exports["default"] = _default;