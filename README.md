# Node.js Express 게시판
- [Development environment](#development-environment)
- [Implementation](#implementation)


</br>
</br>

## Development environment
- Visual Stdio Code: Express - Node.js
- Template Engine : jade
- DB : PostgreSQL
- ES6

</br>
</br>

## Implementation
- [x] PostgreSQL과 연동
- [x] login / logout 기능 -> session에 id값 저장. passport 인증 구현(local)
- [x] register(회원가입) -> DB users 테이블, password는 hash값(bcrypt)
- [x] 글쓰기 -> DB topics 테이블
- [x] 글수정 -> DB topics 테이블 update
- [x] 글삭제 -> DB topics 테이블 delete
- [x] 보안 -> compression, sanitize
- [x] 글 목록, 해당 글 보기
- [x] 작성자 표시, 로그인 시 자신의 닉네임 표시
- [x] flash를 이용해 각종 경고문 생성
- [x] 접근제어(로그인시 글 CRUD 가능, 자신의 글만 수정 및 삭제 가능)
- [x] jade 리팩토링
- [x] bootstrap 추가
- [x] 페이징 기능, 이전, 다음
- [x] 댓글 -> DB comments 테이블. 작성자와 댓글 UI. 자신의 댓글만 삭제 가능.
- [x] 검색 기능 -> title, description, title_description

</br>
</br>

- Home
<img width="280" alt="home" src="https://user-images.githubusercontent.com/78518132/121446530-ad210380-c9ce-11eb-8ae3-acd349c9ae2d.png">
 
</br>
 
- Table
<img width="280" alt="table" src="https://user-images.githubusercontent.com/78518132/121446628-e8233700-c9ce-11eb-874e-c26e62563f2d.png">


</br>
</br>
</br>

[참고 사이트] https://opentutorials.org/course/3083
</br>
[참고 문헌] 기본기에 충실한 Node.js 10 입문서 조현영
