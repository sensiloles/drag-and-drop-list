import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

const render = (Component: React.FunctionComponent<{}>): void => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if ((module as any).hot && process.env.NODE_ENV === 'development') {
  (module as any).hot.accept('./components/App', () => {
    render(App);
  });
}
