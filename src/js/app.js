import {
  catchError, of, interval, mergeMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import CreateNewMessage from './CreateNewMessage';

const mailBox = document.querySelector('.container-mail');

const apiUrl = 'http://localhost:9000/messages/unread';

const messageView = new CreateNewMessage(mailBox);

const messagesIds = new Set();
const messages$ = interval(1000)
  .pipe(
    mergeMap(() => ajax.getJSON(apiUrl)
      .pipe(
        catchError((error) => {
          // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    error: (err) => console.log(err),
  });
