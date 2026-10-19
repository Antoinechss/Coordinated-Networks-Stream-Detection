<h1 align="center">Coordinated-Networks-Stream-Detection</h1>
<h3 align="center"><em>Bounded-Memory Streaming Detection of Coordinated Networks on Bluesky with Kafka and Spark</em></h3>

<p align="center">
  <img width="737" height="416" alt="Coordinated networks stream detection on Bluesky" src="https://github.com/user-attachments/assets/7bfdbd4a-0d28-4929-9c2d-27bf2375ea83">
</p>

## Overview

This project implements a **streaming version** of the coordinated network detection framework introduced by Pacheco et al. [[1]](#references), applied in real time to the Bluesky firehose.

## Motivation

Most tools against online manipulation try to detect bots **one account at a time**. Coordinated campaigns get around this: each account looks normal on its own, and the manipulation only becomes visible when you look at **how accounts behave together**.

The framework therefore builds a **coordination network**, in which two accounts are strongly linked when their behavior is more similar than chance would explain. The original paper applies it to five types of coordination on Twitter:

| # | Coordination signal | Trace |
|---|---|---|
| i | Handle changes | Accounts rotating the same usernames |
| ii | Image sharing | Accounts posting the same or near-identical images |
| iii | Hashtag sequences | Accounts using the same ordered hashtags |
| iv | Co-retweets | Accounts amplifying the same posts |
| v | Synchronization | Accounts acting within the same time windows |

## Method

<p align="center">
  <img width="900" alt="Pacheco et al. four-step coordination detection method" src="https://github.com/user-attachments/assets/99256a1e-5dbd-4143-ad04-c6e81c4df588">
</p>

1. **Behavioral trace extraction.** Formulate a hypothesis about suspicious behavior and choose the traces that reveal it (content, activity, identity, or a combination). Drop low-activity accounts that lack enough evidence.
2. **Bipartite network construction.** Link accounts to the features they use, with TF-IDF weighting so that popular features count less.
3. **Projection onto the account network.** Connect accounts by the similarity of their feature profiles (e.g. cosine similarity), then keep only the highest-weight edges.
4. **Cluster analysis.** Extract groups of coordinated accounts, here as connected components of the filtered network.

## References

[1] D. Pacheco, P.-M. Hui, C. Torres-Lugo, B. T. Truong, A. Flammini, F. Menczer. *Uncovering Coordinated Networks on Social Media: Methods and Case Studies.* ICWSM 2021, 15(1), 455–466. [arXiv:2001.05658](https://arxiv.org/abs/2001.05658)
