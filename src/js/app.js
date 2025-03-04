/* eslint-disable no-console */
import {
  catchError, of, interval, mergeMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import CreateNewMessage from './CreateNewMessage';

import background from '../img/cell.jpg';

document.querySelector('body').style.backgroundImage = `url(${background})`;

const mailBox = document.querySelector('.container-mail');

const messageView = new CreateNewMessage(mailBox);

const messagesIds = new Set();
const messages$ = interval(1000)
  .pipe(
    mergeMap(() => ajax.getJSON('https://polling-backend-j6xa.onrender.com/messages/unread')
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(null);
        }),
      )),
  );

messages$
  .subscribe({
    next: (value) => {
      const newMessages = value.messages.reduce((acc, message) => {
        if (messagesIds.has(message.id)) {
          return acc;
        }

        messagesIds.add(message.id);
        acc.push(message);
        return acc;
      }, []);

      for (const message of newMessages) {
        messageView.renderMessage(message);
      }
    },
    error: (err) => console.log(err),
  });
