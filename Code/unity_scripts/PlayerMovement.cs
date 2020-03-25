using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMovement : MonoBehaviour {
  public float runSpeed = 40f;
  public MainGame mainGame;

  private CharacterController2D controller;
  private Animator animator;
  private Rigidbody2D rb;
  private float horizontalMove;
  private bool jump;
  private bool crouch;

  private const float BLUE_ICE_MOVEMENT_SMOOTHING  = 0.15f;
  private const float WHITE_ICE_MOVEMENT_SMOOTHING = 0.30f;
  private const float ICE_BLOCK_MOVEMENT_SMOOTHING = 0.75f;

  private void Start() {
    horizontalMove = 0f;
    jump = false;
    crouch = false;
    controller = GetComponent<CharacterController2D>();
    animator = GetComponent<Animator>();
    rb = GetComponent<Rigidbody2D>();
  }

  private void Update() {
    if (mainGame.IsReplaying || mainGame.rsg.State != ReadySetGoState.DONE)
      return;

    if (mainGame.State == MainGameState.GO) {
      horizontalMove = Input.GetAxisRaw("Horizontal") * runSpeed;
      animator.SetFloat("Speed", Mathf.Abs(horizontalMove));

      if (Input.GetButtonDown("Jump")) {
        Jump();
      }
      if (Input.GetButtonDown("Crouch")) {
        crouch = true;
      }
      else if (Input.GetButtonUp("Crouch")) {
        crouch = false;
      }
      animator.SetBool("Crouching", crouch);
    }
  }

  private void FixedUpdate() {
    if (mainGame.State == MainGameState.GO) {
      controller.Move(horizontalMove * Time.fixedDeltaTime, crouch, jump);
      jump = false;
      animator.SetBool("Jumping", false);
    }
  }

  public void Jump() {
    jump = true;
    animator.SetBool("Jumping", true);
  }

  private void OnCollisionEnter2D(Collision2D collision) {
    switch (collision.gameObject.tag) {
      case "Blue Ice":
        controller.SetMovementSmoothing(BLUE_ICE_MOVEMENT_SMOOTHING);
        break;
      case "White Ice":
        controller.SetMovementSmoothing(WHITE_ICE_MOVEMENT_SMOOTHING);
        break;
      case "Ice Block":
        controller.SetMovementSmoothing(ICE_BLOCK_MOVEMENT_SMOOTHING);
        break;
    }
  }

  private void OnTriggerEnter2D(Collider2D collision) {
    int knockback = 650;
    if (mainGame.State == MainGameState.GO) {
      switch (collision.tag) {
        case "Goal":
          mainGame.EndLevel();
          break;
        case "Enemy-Left":
          rb.AddForce(Vector2.left * knockback);
          break;
        case "Enemy-Right":
          rb.AddForce(Vector2.right * knockback);
          break;
        case "Enemy-Top":
          Jump();
          rb.AddForce(Vector2.up * (knockback / 2));
          collision.transform.parent.gameObject.SetActive(false);
          break;
        case "Firerock":
          collision.GetComponent<Firerock>().Fall();
          break;
        case "Fireswitch":
          collision.GetComponent<Fireswitch>().FlipSwitch();
          break;
      }
    }
  }
}
