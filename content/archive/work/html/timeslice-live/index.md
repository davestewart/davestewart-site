---
description: Kiosk and online system for live event multi-camera photo studio
date: 2015-04-01
tags:
  - webapp
  - ui
  - vue
  - database
  - laravel
  - php
  - ipad
media:
  thumbnail: ./images/timeslice-feature-01.png
  gallery:
    - ./images/timeslice-01.jpg
    - ./images/timeslice-02.jpg
    - ./images/timeslice-03.jpg
    - ./images/timeslice-04.jpg
    - ./images/timeslice-05.jpg
    - ./images/timeslice-06.jpg
    - ./images/timeslice-07.jpg
    - ./images/timeslice-08.jpg
    - ./images/timeslice-09.jpg
    - ./images/timeslice-10.jpg
    - ./images/timeslice-11.jpg
    - ./images/timeslice-12.jpg
    - ./images/timeslice-13.jpg
---

# Timeslice Live

## Overview

Timeslice Films is a camera and visual effects company, specialising in multi-cam arrays - think Bullet Time from the Matrix - with the majority of their work to-date being for advertising and film, and so confined to the edit suite.

However, in February of 2015, Timeslice Films asked me to get involved in a new project where they would take their technology to live events, and film real people with the aim of generating brand engagement via social media sharing.

Thus was born Timeslice Live; the aim of the project being to convert the raw footage from the rig to interactive animations that can be browsed and chosen by the users, uploaded, viewed on the client's site, and shared online all within 30 seconds of taking a shot.

## Development

The system was developed in 3 distinct phases, balancing requirements and complexity:

- Phase 1 - prototype, with direct email, direct upload to server, and basic sharing API
- Phase 2 - migrated to Laravel, added a watch system, database, upload queue and CDN
- Phase 3 - implemented VueJS and completed admin system and tooling

The overall system has 4 parts:

- the multicam rig and render farm
- local system, including image processing, upload, admin, and kiosks
- remote system, including storage, API and player
- 3rd party integration via APIs

We are currently mid-way through the 3rd phase, with client administration and 3rd party integration planned:

![Timeslice system diagram (Phase 3c)](./images/timeslice-system-diagram-phase-03c.png)

## Process

The kiosk system is part of a much more complicated entity. We travel to and set up at live events, with:

- a 50+ camera rig
- all the equipment needed to run that
- the kiosk server
- kiosk clients (currently iMacs, but will also run on iPads)
- a small render farm
- between 2 and 4 operators
- between 2 and 10 brand ambassadors
- Timeslice and client staff

Events can be anything from an evening, to a week, requiring a couple of days on-site setup.

Once live, customers discover the rig, queue to get in, are guided through having their shot(s) taken, then leave to find their shot likely already-rendered and waiting for them on the kiosk. They can then choose one or more shots, add their name and email information, and have a link emailed to them so they can share their animation on social media.

## Implementation

The local system is built using Laravel 5 and Vue JS, with a MySQL database and a Beanstalkd queue.

The whole process is _extremely_ image-heavy, with a 3-day live event generating around 100GB of images, both raw and processed. The kiosk system might ingest up to 700 sequences of 100 - 200 images and video a day from the render farm, uploading around 4/5 of shots, and sending over 1000 emails:

![images](./images/image-folders-small.png)

Much of the logic and structure is built around processing, logging and moving these images around, both locally and remotely, across various different protocols and applications.

Shots are uploaded to Amazon AWS, and client sites are informed via an API call of shot and user data, allowing them to query our server for all image data and the player

The admin system allows us to browse all events and shots, edit user data, re-render and re-upload shots. Lists can be searched, filtered and viewed in detail or thumbnail modes.

The kiosk client machines connect to the kiosk server over a local network, and is in effect a small intranet. The look and feel for each event can be changed, with kiosks showing the correct logo, a choice of theme, and localised to the correct language.

The kiosk system now supports visual effects and 3d scanning shoots, so for commercial shoots we're able to show clients early visualisations of the shooting process, and we continue to add tools and features as we think of them.


## Links

- [Timeslice Films](http://timeslicefilms.com/)
- [Syfy Fan Cam](http://syfy.co.uk/welcome-fancam)
- [Nikon / I am Your Story](https://iamyourstory.fr/experience-360)

 

