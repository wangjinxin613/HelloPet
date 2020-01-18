import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index.vue';
import AllPet from '@/pages/AllPets.vue';
import PetDetail from '@/pages/PetDetail.vue';
import AllFeeds from '@/pages/AllFeeds.vue';
import People from '@/pages/People.vue';
import Person from '@/pages/Person.vue';
import Custom from '@/pages/Custom.vue';
import MySend from '@/pages/MySend.vue';
import MyReceived from '@/pages/MyReceived.vue';
import MyFeed from '@/pages/MyFeed.vue';
import Error from '@/pages/error.vue';

Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [{
            path: '/',
            name: 'Index',
            component: Index
        }, {
            path: '/allpet',
            name: 'AllPet',
            component: AllPet
        },
        {
            path: '/petDetail',
            name: 'PetDetail',
            component: PetDetail
        },
        {
            path: '/allfeed',
            name: 'AllFeeds',
            component: AllFeeds
        },
        {
            path: '/people',
            name: 'People',
            component: People
        },
        {
            path: '/person/:address',
            name: 'Person',
            component: Person
        },
        {
            path: '/custom',
            name: 'Custom',
            component: Custom
        },
        {
            path: '/mysend',
            name: 'MySend',
            component: MySend
        },
        {
            path: '/myreceived',
            name: 'MyReceived',
            component: MyReceived
        },
        {
            path: '/myfeed',
            name: 'MyFeed',
            component: MyFeed
        },
        {
            path: '/error/:text',
            name: 'error',
            component: Error
        }
    ]
})
