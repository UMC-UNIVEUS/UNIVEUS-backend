<h2> 축제용에서 개선된 사항 </h2>

<details>
<summary>협업 방식 </summary>
    1. issue 명칭을 더 깔끔하고 세세하게 작성
    </br>
    2. PR을 날리면 팀원이 무조건 리뷰
    </br>
    3. 커밋 메세지를 세세하게 작성
</details>

<details>
<summary>코드 리펙토링 </summary>
    1. 축제용 코드 포함 불필요한(반복되거나 비효율적인) 코드 삭제
    </br>
    2. 함수명을 다른 팀원도 잘 이해하도록 변경
    </br>
    3. 카멜 표기법 사용
    </br>
    4. DB 수정에 따른 SQL문 수정
</details>

<details>
<summary>DTO 사용 </summary>
</details>

## 커밋 컨벤션
<details>
<summary><h3> 규칙</h3> </summary>

archivvonjang님의 [블로그](https://velog.io/@archivvonjang/Git-Commit-Message-Convention) 를 참고하여 정리하였습니다.
<br/>
<br/>


## Commit Message Convention

### 1. Commit Message Structure
-   기본적인 커밋 메시지 구조

    ```
      제목 (Type: Subject)
      본문 (Body)
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
    |Feature|새로운 기능을 추가|
    |Bug Fix|버그를 고쳐야하는 경우|
    |Refactoring|Production Code(실제 사용하는 코드) 리팩토링|
    |Update|코드 혹은 파일을 업데이트하는 작업만 수행한 경우 (리펙토링을 제외한 모든 경우)|
    |Delete|코드 혹은 파일을 삭제하는 작업만 수행한 경우|
    <br/>

    추가적인 문맥 정보를 제공하기 위한 목적으로 괄호 안에 적을 수도 있다.
    ```
      [Feature(navigation)]:
      [Bug Fix(DB)]:
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
Bug Fixed --> Bug Fix
```

### 4. Body
-  72 글자 이내로 작성한다.
-  최대한 상세히 작성한다. (코드 변경의 이유를 명확히 작성할수록 좋다)
-  어떻게 변경했는지보다 무엇을, 왜 변경했는지 작성한다.
<br/>

### 5. Example

```
Ex1)
[Feature]: 회원 가입 기능 구현 
SMS, 이메일 중복확인 API 개발 


Ex2)
[Refectoring]: 게시글 작성 API 변경 
게시글 작성 시 참여자 초대의 ~~ 부분에서 프론트에 데이터를 정확하게 응답하기 위해 ~~한 부분을  ~~하게끔 변경한다. 
```
<br/>

커밋 메시지를 여러 줄 입력하려면??
```
git commit -m "커밋메시지 입력
~~~
~~~
```
위처럼 따옴표를 닫지 않고 계속 입력하면 된다.

<br/>


그 외 자주 쓰이는 예시
```
  [Bug Fix]: 게시글 유저 인증 버그 수정                                                  
  Fix my test                                                       
  Fix typo in style.css
  Fix my test to return undefined
```

</details>
