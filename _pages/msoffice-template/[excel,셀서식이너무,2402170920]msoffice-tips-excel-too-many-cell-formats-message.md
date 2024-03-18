---
title: "Excel: 셀 서식이 너무 많습니다. 메시지 해결"
description: "엑셀에서 셀 서식을 변경하고자 할 때 종종 나오는 '셀 서식이 너무 많습니다.' 메시지를 VBA 매크로를 사용하여 해결하는 방법"
updated: 2021-08-16
---

## 셀 서식이 너무 많습니다. 메시지

엑셀 작업을 하다보면 종종 아래와 같은 짜증나는 팝업 창을 만나는 경우가 있다. 이 메시지가 뜨면 글꼴 변경과 같은 서식 지정이 먹통이 된다.

<!--#region-->
![그림00](data:image/png;base64,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)
<!--#endregion-->

잘 사용하지는 않지만 엑셀에도 "스타일" 기능이 있는데 위 메시지가 뜨는 경우에는 스타일 안에 뭔가 쓰레기 값이 넘쳐나는 경우가 많다. 구글링을 해보면 이 스타일이 엑셀이 허용하는 한계치(약 6만4천개)를 초과하는 경우 발생하는 에러 메시지로 보인다.

## VBA 매크로 사용하여 문제 해결

먼저 엑셀 파일의 복사본을 미리 만들어둔다. **VBA 매크로의 실행은 되돌리기가 불가능**하기에, 만에하나 있을지 모를 사고를 예방하기 위해서다.

아래 코드는 매크로를 실행하면 기본으로 내장된 스타일을 제외하고 쓰레기 스타일 값들을 지우는 기능을 한다.

- vba
```vb
Sub RemoveStyles()
  Dim li As Long
  On Error Resume Next

  With ActiveWorkbook
    For li = .Styles.Count To 1 Step -1
      If Not .Styles(li).BuiltIn Then
          .Styles(li).Delete
      End If
    Next
  End With
End Sub
```

매크로를 실행하는데 좀 오래 걸리는데 1~2분 정도 기다리면 된다. 실행이 완료된 후 다시 엑셀로 돌아가면 글꼴이나 색상 변경이 자유로이 되는 것을 확인할 수 있을 것이다.
