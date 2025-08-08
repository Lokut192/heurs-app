export enum Grants {
  // Roles
  SuperAdminRole = 'p_Role.SUPER_ADMIN',
  AdminRole = 'p_Role.ADMIN',
  UserRole = 'p_Role.USER',

  // User
  CreateUser = 'p_User.CREATE',
  ReadUser = 'p_User.READ',
  UpdateUser = 'p_User.UPDATE',
  DeleteUser = 'p_User.DELETE',

  // User settings
  CreateUserSettings = 'p_User.Settings.CREATE',
  ReadUserSettings = 'p_User.Settings.READ',
  UpdateUserSettings = 'p_User.Settings.UPDATE',
  DeleteUserSettings = 'p_User.Settings.DELETE',

  // Roles grants
  UpdateRoleGrants = 'p_Role.Grants.UPDATE',

  // Inbox grants
  CreateInboxMessages = 'p_Inbox.Messages.CREATE',
  ReadInboxMessagesLiveServiceStats = 'p_Inbox.MessagesLiveServiceStats.READ',
}
