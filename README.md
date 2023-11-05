# 협업 규칙

archivvonjang님의 [블로그](https://velog.io/@archivvonjang/Git-Commit-Message-Convention) 를 참고하여 정리하였습니다.

## Commit Message Convention

### 1. Commit Message Structure
-   기본적인 커밋 메시지 구조

    ```
      제목 (Type: Subject)
      (한줄 띄어 분리)
      본문 (Body)
      (한줄 띄어 분리)
      꼬리말 (Footer)
    ```

### 2. Commit Type
-  커밋의 타입 구성
  
    ```
      태그: 제목 
      (:space 제목으로 : 뒤에만 space를 넣는다.)
    ```
    <br/>
    
    |Tag Name|Description|
    |:--:|:--:|
    |Feat|새로운 기능을 추가|
    |Fix|버그 수정|
    |!BREAKING CHANGE|커다란 API 변경의 경우|
    |!HOTFIX|급하게 치명적인 버그를 고쳐야하는 경우|
    |Style|코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우|
    |Refactor|Production Code(실제 사용하는 코드) 리팩토링|
    |Comment|필요한 주석 추가 및 변경|
    |Docs|문서 수정|
    |Test|테스트 코드 추가, Production Code(실제 사용하는 코드) 변경 없음|
    |Chore|빌드 업무 수정, 패키지 매니저 수정, 패키지 관리자 구성 등 업데이트, Production Code 변경 없음|
    |Rename|파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우|
    |Remove|파일을 삭제하는 작업만 수행한 경우|
    <br/>

    추가적인 문맥 정보를 제공하기 위한 목적으로 괄호 안에 적을 수도 있다.
    ```
      Feat(navigation)
      Fix(DB)
    ```

### 3. Subject
-  제목은 50글자 이내로 작성한다.
-  첫글자는 대문자로 작성한다.
-  마침표 및 특수기호는 사용하지 않는다.
-  영문으로 작성하는 경우 동사(원형)을 가장 앞에 명령어로 작성한다.
-  과거시제는 사용하지 않는다.
-  간결하고 요점적으로 즉, 개조식 구문으로 작성한다


```
EX)
Fixed --> Fix
Added --> Add
Modified --> Modify
```

### 4. Body
-  72 글자 이내로 작성한다.
-  최대한 상세히 작성한다. (코드 변경의 이유를 명확히 작성할수록 좋다)
-  어떻게 변경했는지보다 무엇을, 왜 변경했는지 작성한다.


### 5. Footer
-  선택사항
-  자세한 건 블로그 참고


### 6. Example
```
Ex1)
Feat: 회원 가입 기능 구현 ---> Commit Type

SMS, 이메일 중복확인 API 개발 ---> Body

Resolves: #123 ---> Footer (선택 사항항)
Ref: #456
Related to: #48, #45

Ex2)
!BREAKING CHANGE: 게시글 작성 API 변경

게시글 작성 시 참여자 초대의 ~~ 부분에서 프론트에 데이터를 정확하게 응답하기 위해 ~~한 부분을 변경한다.
```
<br/>

그 외 자주 쓰이는 예시
```
  Fix : 버그 수정                                                   ---> Commit Type
  Fix my test                                                       ---> Body
  Fix typo in style.css
  Fix my test to return undefined
  Fix error when using my function

  Update : Fix와 달리 원래 정상적으로 동작했지만 보완의 개념       ---> Commit Type
  Update harry-server.js to use HTTPS                             ---> Body

  Add                                                             ---> Commit Type
  Add documentation for the defaultPort option                     ---> Body
  Add example for setting Vary: Accept-Encoding header in zlib.md

  Remove(Clean이나 Eliminate) : ‘unnecessary’, ‘useless’, ‘unneeded’, ‘unused’, ‘duplicated’가 붙는 경우가 많음 ---> Commit Type
  Remove fallback cache                                                                                       ---> Body
  Remove unnecessary italics from child_process.md

  Refactor : 리팩토링                                                   ---> Commit Type

  Simplify : Refactor와 유사하지만 약한 수정, 코드 단순화                 ---> Commit Type

  Improve : 호환성, 테스트 커버리지, 성능, 검증 기능, 접근성 등의 향상     ---> Commit Type
  Improve iOS's accessibilityLabel performance by up to 20%               ---> Body

  Implement : 코드 추가보다 큰 단위의 구현                                 ---> Commit Type
  Implement bundle sync status                                             ---> Body

  Correct : 주로 문법의 오류나 타입의 변경, 이름 변경 등에 사용             ---> Commit Type
  Correct grammatical error in BUILDING.md                                 ---> Body

  Prevent                                                                 ---> Commit Type
  Prevent hello handler from saying Hi in hi.js                           ---> Body

  Avoid : Prevent는 못하게 막지만, Avoid는 회피(if 등)                     ---> Commit Type
  Avoid flusing uninitialized traces                                       ---> Body

  Move : 코드나 파일의 이동                                                 ---> Commit Type
  Move function from header to source file                                 ---> Body

  Rename : 이름 변경                                                       ---> Commit Type
  Rename node-report to report                                             ---> Body
```

