import { combineReducers } from '@reduxjs/toolkit';

import templateReducer from './reducers/templates/templatesReducer';
import authReducer from './reducers/auth/authReducer';
import adminReducer from './reducers/admins/adminReducer';
import langReducer from './reducers/lang';


const rootReducer = combineReducers({
  templates: templateReducer,
  auth: authReducer,
  admin: adminReducer,
  lang: langReducer,
});

export default rootReducer;