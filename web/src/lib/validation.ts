export const EMAIL_REGEXP = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
export const MOBILE_REGEXP = /^01(?:0|1|[6-9])\d{7,8}$/
export const USERNAME_REGEXP = /^(?!me$)[가-힣a-zA-Z0-9_]{2,20}$/
export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/

export const EMAIL_MESSAGE = '이메일 형식이 올바르지 않아요'
export const MOBILE_MESSAGE = '휴대폰 번호는 하이픈 없이 숫자만 입력해 주세요\n예: 01012345678'
export const USERNAME_MESSAGE = '아이디는 한글, 영문, 숫자, 밑줄(_)로 2~20자여야 해요'
export const PASSWORD_MESSAGE = '비밀번호는 8자 이상이고 영문 대소문자와 특수문자를 포함해야 해요'