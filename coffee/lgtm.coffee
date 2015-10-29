class LGTM
  @refreshRate = 5 * 60 * 1000
  @positiveKeywordsRegexes = []
  @negativeKeywordsRegexes = []

  @defaultOptions:
    "positive-keywords": ":+1:\nlgtm\n:thumbsup:"
    "negative-keywords": ":-1:\n:thumbsdown:"
    "disable-merge": false
    "disable-merge-threshold": 2
    "disable-wip": false
    "disable-wip-keywords": "wip\ndo not merge"
    "change-favicon": true

  initialize: () ->
    refresh()

  regexify: (string) ->
    $.map string.split(/\n/), (sub) ->
      return null if sub.length == 0 || !sub.trim()
      RegExp(sub.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, "\\$&"), "gi")

  formatCount: (count) ->
    if count > 0 then "+#{count}" else "#{count}"

  countVotes: (page) ->
    votes  = {}
    $(".timeline-comment-wrapper", page).each (_, comment) =>
      comment_text   = $(comment).find(".comment-body p").html()
      comment_author = $(comment).find(".timeline-comment-header-text .author").text()
      return unless comment_text || comment_text == ""

      positive = false
      negative = false

      for regex in @positiveKeywordsRegexes
        positive = true if comment_text.match(regex)
      for regex in @negativeKeywordsRegexes
        negative = true if comment_text.match(regex)

      if positive || negative
        votes[comment_author] ||= {}
        votes[comment_author].vote =  1 if positive
        votes[comment_author].vote = -1 if negative
        votes[comment_author].thumb ||= $(comment).find('.timeline-comment-avatar').prop("src")

    voteCount = 0
    voteCount += vote.vote for _, vote of votes

    [voteCount, votes]

  processPullRequest: (url, issue) ->
    $.get url, (response) =>
      [voteCount, votes] = @countVotes(response)
      @addStatus(voteCount, votes, issue)

  addStatus: (count, votes, page) ->
    title = $(".issue-title-link", page).html()
    if @isWIP(title)
      $(page).addClass("lgtm-wip")

    $(".lgtm", page).remove()
    return if count == 0

    $.get chrome.extension.getURL("templates/pr-list-status.tpl"), (template) =>
      container = $("<span>")
      container.addClass("lgtm")
      participants = []
      for name, reviewer of votes
        participants.push(reviewer.thumb)

      ellipsis = if count > 5 then "&hellip;" else ""

      output = Mustache.render template, { count: @formatCount(count), participants: participants[0..5], ellipsis: ellipsis }
      container.html(output)
      $(".issue-meta", page).append(container)
      #$(".table-list-cell-checkbox", page).append(container)

  isWIP: (title) ->
    if title and @disableWIP
      for regex in @disableWIPKeywordsRegexes
        if title.match(regex)
          return true

    return false


  addVotes: (count, votes, page) ->
    $(".lgtm", page).remove()

    $.get chrome.extension.getURL("templates/pr-status.tpl"), (template) =>
      container = $("<span>")
      container.addClass("lgtm")
      participants = []
      for name, reviewer of votes
        participants.push(reviewer.thumb)

      output = Mustache.render template, { count: @formatCount(count), participants: participants }
      container.html(output)

      $(page).append(container)

    if @disableMerge and count < @disableMergeThreshold
      $(".js-merge-branch-action").prop("disabled", true)
      $(".js-merge-branch-action").text("Not reviewed")

    title = $(".js-issue-title").html()
    if @isWIP(title)
      $(".js-merge-branch-action").prop("disabled", true)
      $(".js-merge-branch-action").text("WIP")


  refresh: () ->
    chrome.storage.sync.get null, (items) =>
      defaultOptions = @constructor.defaultOptions
      items["positive-keywords"]       ||= defaultOptions["positive-keywords"]
      items["negative-keywords"]       ||= defaultOptions["negative-keywords"]
      items["disable-merge-threshold"] ||= defaultOptions["disable-merge-threshold"]

      items["disable-merge"] = defaultOptions["disable-merge"] if items["disable-merge"] == null

      items["disable-wip"] = defaultOptions["disable-wip"] if items["disable-wip"] == null
      items["disable-wip-keywords"]    ||= defaultOptions["disable-wip-keywords"]

      items["change-favicon"] = defaultOptions["change-favicon"] if items["change-favicon"] == null

      @positiveKeywordsRegexes   = @regexify(items["positive-keywords"])
      @negativeKeywordsRegexes   = @regexify(items["negative-keywords"])

      @disableMerge          = items["disable-merge"]
      @disableMergeThreshold = items["disable-merge-threshold"]

      @disableWIP                = items["disable-wip"]
      @disableWIPKeywordsRegexes = @regexify(items["disable-wip-keywords"])

      @changeFavicon             = items["change-favicon"]

      [count, votes] = @countVotes($(".view-pull-request"))
      @addVotes(count, votes, $(".discussion-sidebar"))
      @setFavicon(count) if @changeFavicon

      $(".table-list-issues .table-list-item").each (_, issue) =>
        @processPullRequest($(".issue-title-link", issue).prop("href"), issue)

  setFavicon: (count) ->
    favicon = $("link[type='image/x-icon']")
    if count
      chrome.runtime.sendMessage { message: "lgtm:update-favicon", count: count }, (response) ->
        favicon.prop "href", response.dataurl
    else
      favicon.prop "href", "https://assets-cdn.github.com/favicon.ico"


inject = $("<script>")
inject.prop("src", chrome.extension.getURL("js/pushstate.js"))
$("head").append(inject)

window.lgtm = new LGTM()
$(() ->
  window.lgtm.refresh()
)

window.addEventListener "message", (event) ->
  if event.data.action == "lgtm:refresh"
    window.lgtm.refresh()
