import { checkEmailFx, checkEmail } from '@/models/auth/register/checkEmail';
import {
  checkUsernameFx,
  checkUsername,
} from '@/models/auth/register/checkUsername';
import { useEvent, useStore } from 'effector-react';
import debounce from 'lodash.debounce';

const INPUT_DEBOUNCE_TIME = 225;

export const useFieldsChecks = () => {
  const loadingUsernameCheck = useStore(checkUsernameFx.pending);
  const loadingEmailCheck = useStore(checkEmailFx.pending);

  const onChangeUsername = useEvent(checkUsername);
  const onChangeUsernameDebounced = debounce(
    onChangeUsername,
    INPUT_DEBOUNCE_TIME,
  );

  const onChangeEmail = useEvent(checkEmail);
  const onChangeEmailDebounced = debounce(onChangeEmail, INPUT_DEBOUNCE_TIME);

  return {
    loadingUsernameCheck,
    loadingEmailCheck,
    onChangeUsernameDebounced,
    onChangeEmailDebounced,
  };
};
