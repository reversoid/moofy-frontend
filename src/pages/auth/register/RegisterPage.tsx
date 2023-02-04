import { useForm } from 'react-hook-form';
import { Text, Button, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import React, { useMemo, memo } from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Heading from '@/features/auth/components/Title';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import {
  register as registerEvent,
  $registerStatus,
} from '@/models/auth/register';
import { Form, SubmitContainer } from '@/features/auth/components/Form';
import {
  StyledInput,
  StyledPassword,
} from '@/features/auth/components/StyledInputs';
import {
  EMAIL_VALIDATORS,
  RegisterFormData,
  PASSWORD_VALIDATORS,
  USERNAME_VALIDATORS,
} from '@/features/auth/utils/register/formUtils';
import InfoIconWithTooltip from '@/features/auth/components/InfoIconWithTooltip';
import { Link } from 'react-router-dom';
import { checkEmailFx } from '@/models/auth/register/checkEmail';
import { checkUsernameFx } from '@/models/auth/register/checkUsername';
import { useFieldsChecks } from './useFieldsChecks';

const RegisterPage = () => {
  useDefaultScrollbarGutter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    formState: { errors, isValid: isFormValid },
  } = useForm<RegisterFormData>({ mode: 'onChange' });

  const {
    loadingEmailCheck,
    loadingUsernameCheck,
    onChangeEmailDebounced,
    onChangeUsernameDebounced,
  } = useFieldsChecks();

  useMemo(
    () =>
      checkUsernameFx.doneData.watch((userExists) => {
        if (userExists) {
          setError('username', { message: 'Имя пользователя уже занято' });
        } else {
          clearErrors('username');
          trigger('username');
        }
      }),
    [],
  );

  useMemo(
    () =>
      checkEmailFx.doneData.watch((userExists) => {
        if (userExists) {
          setError('email', { message: 'Email уже зарегистрирован' });
        } else {
          clearErrors('email');
          trigger('email');
        }
      }),
    [],
  );

  let submitButtonDisabled =
    !isFormValid ||
    loadingEmailCheck ||
    loadingUsernameCheck ||
    Boolean(Object.keys(errors).length);

  const onSubmit = useEvent(registerEvent);

  const { loading } = useStore($registerStatus);

  return (
    <AuthContainer xs>
      <Heading h1>Регистрация</Heading>
      <Form id="register-form" onSubmit={handleSubmit(onSubmit)}>
        <StyledInput
          label="Имя пользователя"
          placeholder="username123"
          fullWidth
          size="xl"
          status={errors.username && 'error'}
          contentRight={
            loadingUsernameCheck ? (
              <Loading size="sm" />
            ) : (
              errors.username?.message && (
                <InfoIconWithTooltip message={errors.username?.message} />
              )
            )
          }
          {...register('username', {
            ...USERNAME_VALIDATORS,
            onChange(e) {
              submitButtonDisabled = true;
              onChangeUsernameDebounced({ username: e.target.value });
            },
          })}
        />
        <StyledInput
          autoComplete="true"
          type="email"
          label="Email"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          status={errors.email && 'error'}
          {...register('email', {
            ...EMAIL_VALIDATORS,
            onChange(e) {
              submitButtonDisabled = true;
              onChangeEmailDebounced({ email: e.target.value });
            },
          })}
          contentRight={
            loadingEmailCheck ? (
              <Loading size="sm" />
            ) : (
              errors.email?.message && (
                <InfoIconWithTooltip message={errors.email?.message} />
              )
            )
          }
        />
        <StyledPassword
          label="Пароль"
          placeholder="Пароль"
          fullWidth
          size="xl"
          status={errors.password && 'error'}
          {...register('password', PASSWORD_VALIDATORS)}
          contentRight={
            errors.password?.message && (
              <InfoIconWithTooltip message={errors.password?.message} />
            )
          }
        />
      </Form>
      <SubmitContainer>
        <Button
          type="submit"
          form="register-form"
          css={{ '@xsMin': { width: 'max-content !important' } }}
          size="lg"
          disabled={submitButtonDisabled}
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Зарегистрироваться'
          )}
        </Button>
        <Text as="p">
          Уже есть аккаунт?{'  '}
          <Link to="/auth/login">Войти</Link>
        </Text>
      </SubmitContainer>
    </AuthContainer>
  );
};

export default memo(RegisterPage);