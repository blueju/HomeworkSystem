export default ({
  app
}) => {
  // app.router.beforeEach((to, from, next) => {
  //   console.log(app);
  //   console.log(to.path)
  //   console.log(to.path.slice(14))
  //   console.log(to.path.slice(11))
  //   console.log(to.path.slice(14))
  //   let type = app.store.state.type;
  //   let admin = ['publish', 'download-homework', 'publish-notice'];
  //   let student = ['history-homework', 'recently-homework'];
  //   let teacher = ['publish', 'download-homework', 'publish-notice'];
  //   switch (type) {
  //     case 'student':
  //       if (student.indexOf(to.path.slice(14)) > -1) {
  //         next()
  //       } else {
  //         next(false)
  //       }
  //       break
  //     case 'admin':
  //       if (admin.indexOf(to.path.slice(11)) > -1) {
  //         next()
  //       } else {
  //         next(false)
  //       }
  //       break
  //     case 'teacher':
  //       if (teacher.indexOf(to.path.slice(14)) > -1) {
  //         next()
  //       } else {
  //         next(false)
  //       }
  //       break
  //   }
  //   next()
  // })
}
