import { Button, Checkbox, Form, Input } from 'antd';
import Router from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { SIGN_UP_REQUEST } from '../reducers/user';

//custom hook
const SignUpError = styled.div`
  color:red; 
`
export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue); 
  const handler = useCallback((e) => {  //value from input, setter from useState
    setter(e.target.value);
  }, []);

  return [value, handler];
};

//custom hook end

const Signup = () => {
  const [passwordCheck, setPasswordCheck] = useState(''); //value, setter
  const [term, setTerm] = useState(false); // why false //check or not check
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [id, onChangeId] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();
  const { isSigningUp, me, isSignedUp } = useSelector(state => state.user);

  useEffect(() => {
    if (me) {
       alert('Now you logged in, moving to the main page.');   
      Router.push('/');
    }
  }, [me && me.id]);

  useEffect(()=>{
    if(isSignedUp){
      alert("You are signed up :). Please log in")
      Router.push('/');
    }
  }, [isSignedUp])

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      return setPasswordError(true); 
    }
    if (!term) {
      return setTermError(true);
    }
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        userId: id,
        password,
        nickname: nick,
      },
    });
  }, [id, nick, password, passwordCheck, term]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(e.target.value !== password); //true false return
    setPasswordCheck(e.target.value);
  }, [password]); 

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  if (me) {
    return null; 
  }

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-id">ID</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">Nick Name</label>
          <br />
          <Input name="user-nick" value={nick} required onChange={onChangeNick} />
        </div>
        <div>
          <label htmlFor="user-password">Password</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">Passowrd Check</label>
          <br />
          <Input
            name="user-password-check" type="password" value={passwordCheck} required
            onChange={onChangePasswordCheck}
          />
          {passwordError && <SignUpError>Entered password does not match.</SignUpError>  }
        </div>
        <div>
          <Checkbox name="user-term" value={term} onChange={onChangeTerm}>I agree to the terms</Checkbox>
          {termError && <SignUpError>You have to agree to terms. </SignUpError>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>Sign up</Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
