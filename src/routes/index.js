import Home from '../components/home';
import Main from '../containers/main';
import Collection from '../containers/collection';
import Doc from '../containers/doc';

export const routes = [
  {
    path: '/',
    component: Main,
    indexRoute: {
      component: Home
    },
    childRoutes: [
      { path: '/collections/:name', component: Collection },
      { path: '/collections/:name/:id', component: Doc }
    ]
  }
];
