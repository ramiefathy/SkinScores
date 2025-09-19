# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "Welcome back" [level=4] [ref=e5]
  - paragraph [ref=e6]: Sign in to access your SkinScores workspace.
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic: Email
      - generic [ref=e9]:
        - textbox "Email" [ref=e10]
        - group:
          - generic: Email
    - generic [ref=e11]:
      - generic: Password
      - generic [ref=e12]:
        - textbox "Password" [ref=e13]
        - group:
          - generic: Password
    - button "Sign in" [ref=e14] [cursor=pointer]
  - generic [ref=e15]:
    - link "Create account" [ref=e16] [cursor=pointer]:
      - /url: /auth/register
    - link "Forgot password?" [ref=e17] [cursor=pointer]:
      - /url: /auth/reset
```