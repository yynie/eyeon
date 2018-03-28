import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import {homeRouter,signinRouter} from './routers'
import Util from '../common/Util'
import Cookies from '../common/Cookies'

Vue.use(Router)

export const router = new Router({
//  mode: 'history', //这样就url就不会显示#
  routes: [
    homeRouter,
    signinRouter,
  ]
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  if(to.meta.title === ''){
    Util.title(TITEL_PREFIX);
  }else{
    Util.title(to.meta.title);
  }

  var user = Cookies.get('8EEFF760CE134927BFD3CCDAC2ADFF32');
  console.log("Cookies:user="+user);
  if (!user){
    if (to.name !== 'SignIn') {
      if (from.name === 'SignIn') {
       // console.log("sign in, stay in \"SignIn\"");
        iView.LoadingBar.finish();
        window.scrollTo(0, 0);
        next(false);
      }else{
       // console.log("not sign in, redirect to \"SignIn\"");
        next({name: 'SignIn'});
      }
    } else {
      //console.log("go SignIn!");
      next();
    }
  }else{
    if(from.name !== 'SignIn'){
      console.log("update cookies");
      Cookies.delete('8EEFF760CE134927BFD3CCDAC2ADFF32');
      Cookies.set('8EEFF760CE134927BFD3CCDAC2ADFF32', user, {expires:COOKIE_EXPIRED,unit:COOKIE_EXPIRED_UNIT});
    }
    if (to.name === 'SignIn') {
      if (from.name === 'Home') {
        //console.log("sign in, stay in \"Home\"");
        iView.LoadingBar.finish();
        window.scrollTo(0, 0);
        next(false);
      } else {
        //console.log("sign in, redirect to \"Home\"");
        next({name: 'Home'});
      }
    } else {
      //console.log("go!");
      next();
    }
  }
});

router.afterEach(route => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
