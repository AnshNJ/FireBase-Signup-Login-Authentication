import classes from './ProfileForm.module.css';
import { useRef , useContext} from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const submitHandler = event => {
    event.preventDefault();

    const newPassword = newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDfMya9QbN_4CB0rFwHEpTHnL3f26x_Akw',
    {
      method: 'POST',
      header: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        idToken: authCtx.token,
        password: newPassword,
        returnSecureToken : false,
      })
    }).then(res => {
      // assumption : always succeeds!
      history.replace('/')

    })

  }


  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
