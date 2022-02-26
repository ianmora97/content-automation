<p align="center">
  <img src="https://raw.githubusercontent.com/ianmora97/content-automation/dev/public/img/logo.png" width="200" height="200"/>
</p>

<h3 align="center"><strong>Content Automation</strong></h3>

<p align="center">
  Optimize processes and tasks on BMW content capability.
  <br>
  <br>
  <a href="https://github.com/ianmora97/content-automation/tree/dev">Desktop App</a>
  ·
  <a href="https://github.com/ianmora97/content-automation/tree/chrome-extension">Chrome Extension</a>
</p>


## Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)


## Installation

### For development:

_**You must have NodeJs with npm installed on your Mac**_

1. Clone the repo: `git clone https://github.com/ianmora97/content-automation.git`
2. On main folder run: `npm install`
3. When installation is done run: `npm start`

### Quick Start:

1. [Download the lastest release](https://github.com/ianmora97/content-automation/releases/tag/v1-beta.2)
2. Double click on the .dmg file

## Features

### Desktop App

- [Cosy Images](#cosy-images)
- [Model Year Updates](#model-year-updates)
- [Offers](#offers)
  - [Regions](#regions)
  - Loyalty
- [Techspecs](#techspecs)
  - [Values](#values)
  - [NA Code](#na-code)
  - [Templates](#templates)
- [Confluence](#confluence)
- [Jira](#jira-tab)
- [Text Editor](#text-editor)

### Chrome Extension

- [Grid](#grid)
- [Spacers](#spacers)
- [Jira](#jira)
- [Resize Window](#resize-window)
- [Links](#links)
- [Right Click](#right-click)

# Desktop App

## Cosy Images

Cosy Images are pulled from Sulzer Server Configuration, this "API" on the Content Automation app you have different Cosy configurations, these ones regarding how the Components on AEM are displaying the image. Our differents Cosy Configurations are:

- All Cosys
- Model Line Up
- Local Nav Dropdown
- Build Your Own
- BYO List
- ALl BMWs page
- Global Nav

On each Card we have the path **builded** of the model, we can copy and pasted where we need it. Cards provides Background and Angle configurations where we can change to a black, white or transparent background, and the angle for each Cosy configuration. We also have a "Colors" section where we can change the color of the car. All these configurations updates the link and the preview model image :sparkles: 


## Model Year Updates

We always have to update PDPs, in this task we have all our models with all their paths on AEM, Staging, Prod, and Live to check them really fast. We can easily open each url on the browser.

## Offers

#### Regions:

Here we have all MACOs per region, we have a quick access to each MACO where we can open any url on the browser, also the task provides the URls for Staging, Prod, and Live per region.

## Techspecs

- #### Values:

Here we can check which model vehicle has any especific TechSpec. Green Models has the property, Red Models doesn't.

- #### NA Code:

We can select an NA Code and see what will looks like on the Features and Specifications section on every PDP.

- #### Templates:

Here we have a list of models and NA codes to check and verify where should this model go on the "TechSpec Editor".

## Confluence

We always has deployments, and this section can provide us which PM made the realease notes and when is the deployment. This is very usefull when we don't know the incoming deployments. This one is using an API from Attlasian.

## Jira Tab

On Jira Tab we can type the CONT-BWD-CREATE ticket and these one builds the Version and Workflow name from the Jira Page, so we can easily copy and paste it where we need it. These API also provides the Status, Priority and Realese date of that ticket.

## Text Editor

On this Dialog we can type any bmwusa url, and these build us the Staging, Prod, and live url, it depends on the subdomain we type.

# Chrome Extension:

## Grid

The "Grid" button on the Chrome Extension toggles the 25 columns on any page of bmwusa, so we can easily check where is a CTA or Image placed and how many columns this one is using.

## Spacers

The "Spacers" button toggles all the Spacers that we have on a page, this is usefull when we have to check how many spacer is between sections or Headlines.

## Jira

When we are on a Jira ticket, we can easily touch the "Jira" button on Chrome Extension and this button copy from the page the ticket number and name, this is very usefull when we have to create a Version or Workflow on AEM.

## Resize Window

We can easily resize our Chrome Window from the extension. We have Desktop, Tablet, and Mobile Breakpoints and an adicional input where we can type any breakpoint from +300px. Breakpoints can be modify from chrome extension options.

## Links

When we are on any live page the chrome extension build us the same page on Staging, Prod and, AEM editor so we can open it on another tab.

## Right Click

PMs usually give us the live version of the page we have to author, on a Jira ticket we can right click the link select the "Open on AEM" option to open the AEM editor of this page.

























