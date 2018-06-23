import { Route } from 'react-router-dom';

const Button = () =>
    <Route render={({ history }) =>
        <button
            type='button'
            onClick={() => { history.push('/new-location'); }}
        >
     		 Click Me!
        </button>
    } />;

export default Button;
