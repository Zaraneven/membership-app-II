import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import auth from './../auth/auth-helper';
import { remove } from './api-user.js';
import { Redirect } from 'react-router-dom';

const DeleteUser = (props) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();

  const clickButton = () => setOpen(true);

  const handleRequestClose = () => setOpen(false);

  const deleteAccount = () => {
    remove({ userId: props.userId }, jwt.token).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearToken(() => console.log('deleted'));
        setRedirect(true);
      }
    });
  };

  if (redirect) return <Redirect to='/' />;

  return (
    <span>
      <IconButton aria-label='Delete' onClick={clickButton} color='secondary'>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={deleteAccount} color='primary' autoFocus='autoFocus'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

DeleteUser.prototype = { userId: PropTypes.string.isRequired };

export default DeleteUser;