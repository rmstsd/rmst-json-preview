import { faker } from '@faker-js/faker'

faker.setLocale('zh_CN')

export const fakeData = Array.from({ length: 5 }, () => ({
  title: Math.random().toString(36),
  cc: [],
  dd: {},
  // .repeat(Math.floor(Math.random() * 20))
  jsonString: `{
      "ghj": 2,
      "qwer": "qwer qwer",
      "level": 1,
      "notification": {
        "qwer": 1,
        "invitation_bubble": 0,
        "promotion_will_expire": 0,
        "level_upgrade": 0,
        "read_count_increased": 0,
        "apply_pass": 0,
        "accessed": 0,
        "experience_can_apply": 0,
        "custom_msg": 0
      },
      "creator_status": 1,
      "content_cooperation": false,
      "creator_c_level": 0
    }`,
  arr: [1, faker.internet.userName(), 3],
  obj: {
    aaa: faker.internet.userName().repeat(20),
    bbb: faker.internet.userName(),
    qwe: {},
  }
}))
