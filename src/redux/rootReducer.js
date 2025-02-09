import { combineReducers } from '@reduxjs/toolkit';

import templateReducer from './reducers/templates/templatesReducer';
import authReducer from './reducers/auth/authReducer';


const rootReducer = combineReducers({
  templates: templateReducer,
  auth: authReducer,
});

export default rootReducer;