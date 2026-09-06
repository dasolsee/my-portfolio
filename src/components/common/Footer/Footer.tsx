import styles from './Footer.module.css'

function Footer(){
    //현재 년도를 자동으로 가져와서 매년 직접 수정하지 않게
    const currentYear = new Date().getFullYear()

      return (
          <footer className={styles.footer}>
              <div className={`container ${styles.inner}`}>
                  <p>© {currentYear} Shin Dasol. All rights reserved.</p>

                  <div className={styles.links}>
                      <a
                          href="https://github.com/dasolsee"
                          target="_blank"
                          rel="noreferrer"
                      >
                          GitHub
                      </a>

                      <a href="mailto:dasol_2@naver.com">Email</a>
                  </div>
              </div>
          </footer>
      )
  }

  export default Footer