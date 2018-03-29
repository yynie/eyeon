import ERROR404 from '@/components/error-404';
export const signinRouter = {
    path: '/vaddwebsock/login',
    name: 'SignIn',
    meta: {
        title: '登录'
    },
    component: () => import('@/components/SignIn.vue')
};

export const homeRouter = {
    path: '/vaddwebsock',
    name: 'Home',
    meta: {
        title: ''
    },
    component: () => import('@/components/Home.vue'),
};

export const page404 = {
  path: '/*',
  name: '404',
  meta: {
      title: '404-页面不存在'
  },
  component: ERROR404
};