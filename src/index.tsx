/* @refresh reload */
import 'virtual:uno.css'
import { render } from "solid-js/web";
import { Route, Router } from '@solidjs/router';
import { JingYunCup4 } from './rules/jingyuncup4';
import { JingYunCup2 } from './rules/jingyuncup2';

render(() => <>
  <Router>
    <Route path="/" component={JingYunCup4} />
    <Route path="/2" component={JingYunCup2} />
    <Route path="/4" component={JingYunCup4} />
  </Router>
</>, document.getElementById("root") as HTMLElement);
