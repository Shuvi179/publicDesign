import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./booksMenu.module.scss";

const BooksMenu = () => {
  return (
    <ul className={styles["books-menu"]}>
      <li className={styles["books-menu-item"]}>
        <NavLink exact to="/books" activeClassName={styles["active"]} className={styles["books-menu-link"]}>
          <span className={styles["books-menu-icon"]}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6777 5.21942C11.6774 5.21915 11.6771 5.21887 11.6768 5.2186L6.78128 0.32373C6.57261 0.11499 6.29518 0 6.00007 0C5.70497 0 5.42754 0.114899 5.21878 0.323639L0.32579 5.21603C0.324142 5.21768 0.322494 5.21942 0.320846 5.22107C-0.107665 5.65201 -0.106932 6.3512 0.322952 6.78104C0.519352 6.97751 0.778748 7.09131 1.05609 7.10321C1.06735 7.10431 1.07871 7.10486 1.09015 7.10486H1.28527V10.7072C1.28527 11.42 1.86531 12 2.5784 12H4.4937C4.68781 12 4.84529 11.8426 4.84529 11.6484V8.82422C4.84529 8.49893 5.10991 8.23434 5.43523 8.23434H6.56492C6.89024 8.23434 7.15486 8.49893 7.15486 8.82422V11.6484C7.15486 11.8426 7.31225 12 7.50645 12H9.42175C10.1348 12 10.7149 11.42 10.7149 10.7072V7.10486H10.8958C11.1908 7.10486 11.4683 6.98996 11.6771 6.78122C12.1074 6.35065 12.1076 5.65027 11.6777 5.21942Z" fill="#1C1C1E" />
            </svg>
          </span>
          Главная
        </NavLink>
      </li>
      <li className={styles["books-menu-item"]}>
        <NavLink exact to="/books/favourite" activeClassName={styles["active"]} className={styles["books-menu-link"]}>
          <span className={styles["books-menu-icon"]}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 36 32">
              <path d="M7 4h-6c-0.55 0-1 0.45-1 1v22c0 0.55 0.45 1 1 1h6c0.55 0 1-0.45 1-1v-22c0-0.55-0.45-1-1-1zM6 10h-4v-2h4v2z"></path>
              <path d="M17 4h-6c-0.55 0-1 0.45-1 1v22c0 0.55 0.45 1 1 1h6c0.55 0 1-0.45 1-1v-22c0-0.55-0.45-1-1-1zM16 10h-4v-2h4v2z"></path>
              <path d="M23.909 5.546l-5.358 2.7c-0.491 0.247-0.691 0.852-0.443 1.343l8.999 17.861c0.247 0.491 0.852 0.691 1.343 0.443l5.358-2.7c0.491-0.247 0.691-0.852 0.443-1.343l-8.999-17.861c-0.247-0.491-0.852-0.691-1.343-0.443z"></path>
            </svg>
          </span>
          Мои книги
        </NavLink>
      </li>
      <li className={styles["books-menu-item"]}>
        <NavLink exact to="/books/history" activeClassName={styles["active"]} className={styles["books-menu-link"]}>
          <span className={styles["books-menu-icon"]}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.5 11C8.53757 11 11 8.53757 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 8.53757 2.46243 11 5.5 11ZM6 2.44447C6 2.16832 5.77614 1.94447 5.5 1.94447C5.22386 1.94447 5 2.16832 5 2.44447V6.11113V6.46402L5.3325 6.58224L7.8325 7.47112C8.09268 7.56363 8.3786 7.4277 8.47111 7.16751C8.56362 6.90733 8.42769 6.62141 8.1675 6.5289L6 5.75825V2.44447Z" fill="#1C1C1E" />
            </svg>
          </span>
          История
        </NavLink>
      </li>
    </ul>
  )
};

export default BooksMenu;