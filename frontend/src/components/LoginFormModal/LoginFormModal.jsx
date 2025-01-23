import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    try {
      const response = await dispatch(sessionActions.login({ credential, password }));
      if (response.ok) {
        closeModal();
      }
    } catch (res) {
      const data = await res.json();
      if (data && data.message) {
        setErrors(data.message);
      }
    }
  };

  const loginDemo = async (e) => {
    e.preventDefault();
      await dispatch(sessionActions.login({
        "credential": "Demo-lition",
        "password": "password"
      }));
      closeModal();
    }



  const disableLoginButton = credential.length < 4 || password.length < 6;

  return (
    <>
      <h1 className='logInText'>Log In</h1>
      <form className='logInform' onSubmit={handleSubmit}>
        <label className='username'>
          Username or Email
          <input className= 'usernameBox'type="text" value={credential}
            onChange={(e) => setCredential(e.target.value)} required/>
        </label>
        <label className='password'>
          Password
          <input className='passwordBox' type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required/>
        </label>
        {errors && (<p className="error-message">{errors}</p>)}
        <button className= 'submitButton'type="submit" disabled={disableLoginButton}>Log In</button>
      </form>
        <div className = 'demoButton'>
        <text onClick={loginDemo}>Log in as Demo User</text>
        </div>
    </>
  );
}

export default LoginFormModal;