import Styles from '../styles/Pagination.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useEffect} from "react";
export default ({hasPrevPage, hasNextPage, prevPage, nextPage, page, isClub = false, url = ''}) => {
    const dispatch = useDispatch();
    const router = useRouter()
    return(
        <div className={Styles.paginate}>
            {
                hasPrevPage
                    ? <span onClick={() => router.push(isClub ? url + `?page=${prevPage}` : router.pathname + `?page=${prevPage}`)}>السابق</span>
                    : <span className={Styles.no}>السابق</span>
            }
            <div>
                <span>الصفحة الحالية [{page}]</span>
            </div>
            {
                hasNextPage
                    ? <span onClick={() => router.push(isClub ? url + `?page=${nextPage}` : router.pathname + `?page=${nextPage}`)}>التالي</span>
                    : <span className={Styles.no}>التالي</span>
            }
        </div>
    )
}
