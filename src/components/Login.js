import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import styled from "styled-components";
import { REACT_APP_GOOGLE_CLIENT_ID } from './config';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
`;

const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 40px;
`;

const LoginButton = styled.div`
  font-size: 1.2rem;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #4285f4;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #357ae8;
  }
`;

const Login = ({ onLoginSuccess, onLoginFailure }) => {
  return (
    <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
      <LoginContainer>
        <LoginCard>
          <Title>Welcome to EisenFlow</Title>
          <Subtitle>Please sign in to continue</Subtitle>
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={onLoginFailure}
            render={(renderProps) => (
              <LoginButton onClick={renderProps.onClick} disabled={renderProps.disabled}>
                Login with Google
              </LoginButton>
            )}
          />
        </LoginCard>
      </LoginContainer>
    </GoogleOAuthProvider>
  );
};

export default Login;