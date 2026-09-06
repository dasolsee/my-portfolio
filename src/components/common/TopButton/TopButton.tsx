import topButtonIcon from '../../../assets/icons/TopButton.svg'
import styles from './TopButton.module.css'

function TopButton() {
    function moveToTop() {
        // 버튼을 누르면 현재 페이지의 맨 위로 부드럽게 이동한다.
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <button
            className={styles.button}
            type="button"
            aria-label="페이지 맨 위로 이동"
            onClick={moveToTop}>

            {/* 버튼의 기능은 aria-label로 설명하므로 이미지는 장식으로 처리한다. */}
            <img src={topButtonIcon} alt="" />
        </button>
    )
}

export default TopButton