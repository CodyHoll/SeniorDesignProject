using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public enum MainGameState {
  ALMOST_READY,
  GO,
  EXITING
}

public class MainGame : MonoBehaviour {
  public int levelId;
  public GameObject player;
  public Timer timer;
  public ReadySetGo rsg;
  private PlayerQueue queue;

  public MainGameState State { get; private set; }
  public bool IsReplaying { get; private set; }

  private void Start() {
    if (Game.CurrentlyPlayingQueue == null) {
      queue = new PlayerQueue(player);
      IsReplaying = false;
    }
    else {
      Game.CurrentlyPlayingQueue.SetPlayer(player);
      IsReplaying = true;
    }

    State = MainGameState.ALMOST_READY;
    rsg.Show();
  }

  private void FixedUpdate() {
    if (rsg.State == ReadySetGoState.DONE && State == MainGameState.ALMOST_READY)
      State = MainGameState.GO;

    if (State != MainGameState.EXITING && rsg.State == ReadySetGoState.DONE)
      timer.Unfreeze();

    if (State == MainGameState.EXITING)
      return;

    if (IsReplaying) {
      if (Game.CurrentlyPlayingQueue.IsEmpty) {
        EndLevel();
      }
      else {
        Game.CurrentlyPlayingQueue.Dequeue();
      }
    }
    else {
      queue.Enqueue();
    }
  }

  public void EndLevel() {
    State = MainGameState.EXITING;
    if (IsReplaying) {
      timer.Freeze(Game.CurrentlyPlayingQueue.Time);
      Game.DonePlayingQueue(levelId);
    }
    else {
      timer.Freeze();
      queue.SetTime(timer.SecsElapsed);
      Game.AddQueue(levelId, queue);
      queue = null;
    }
    SceneManager.LoadScene("Title");
  }
}
