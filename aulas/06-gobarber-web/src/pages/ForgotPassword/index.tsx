import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useToast } from '../../hooks/toast';

import getValidateErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        // TODO Recuperação de senha
        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperaão enviado',
          description:
            ' Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidateErrors(err);

          formRef.current?.setErrors(errors);
        }

        // disparar um toasty
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao fazer a recuperação de senha, tente novamente',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar Senha</h1>

            <Input icon={FiMail} name="email" placeholder="E-mail" />

            <Button loading={loading} type="submit">
              {' '}
              Recuperar{' '}
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar ao Login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};
export default ForgotPassword;