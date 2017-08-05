(function ($) {

  "use strict"

  let DATA_KEY = 'ca.menu'
  let EVENT_KEY = DATA_KEY + '.'

  let Event = {
    HIDE: EVENT_KEY + 'hide',
    HIDDEN: EVENT_KEY + 'hidden',
    SHOW: EVENT_KEY + 'show',
    SHOWN: EVENT_KEY + 'shown'
  }

  let Selector = {
    MaterialMenu: '.md-menu',
    DATA_TOGGLE: '[data-toggle="menu"]'
  }

  let MaterialMenu = function () {

    let MaterialMenu = function MaterialMenu(target, config, button) {
      this.$menu = $(target)
      this.$button = $(button)
      this.init(config)
    }

    MaterialMenu.prototype.VERSION = '1.0'

    MaterialMenu.prototype.Classes_ = {
      CONTAINER: 'md-menu',
      OUTLINE: 'md-menu__outline',
      ITEM: 'md-menu__item',
      IS_VISIBLE: 'md-menu-wrapper--visible',
      IS_ANIMATING: 'md-menu-wrapper--animating',
      UNALIGNED: 'md-menu-wrapper--unaligned',
      IS_LEAVING: 'md-menu-wrapper--leaving',
      BACKDROP: 'md-menu-backdrop',
      IS_OPEN: 'md-menu-wrapper--open',
      BOTTOM_LEFT: 'md-menu--bottom-left',
      BOTTOM_RIGHT: 'md-menu--bottom-right',
      TOP_LEFT: 'md-menu--top-left',
      TOP_RIGHT: 'md-menu--top-right'
    }

    MaterialMenu.prototype.Default = {
      position: 'bottom right',
      offset: false,
      textField: false,
      location: 'top', //top bottom auto follow
      follow: null,
      type: null
    }

    MaterialMenu.prototype.Constant_ = {
      TRANSITION_DURATION_SECONDS: 0.3,
      TRANSITION_DURATION_FRACTION: 0.8,
      CLOSE_TIMEOUT: 300,
      BOTTOM_LEFT: 'bottom left',
      BOTTOM_RIGHT: 'bottom right',
      TOP_LEFT: 'top left',
      TOP_RIGHT: 'top right',
      CENTER_CENTER: 'center center',
      CENTER_LEFT: 'center left',
      CENTER_RIGHT: 'center right'
    }

    MaterialMenu.prototype.Keycodes_ = {
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      UP_ARROW: 38,
      DOWN_ARROW: 40
    }

    MaterialMenu.prototype.init = function (config) {
      this.config = $.extend({}, this.Default, config)
      this.$menuContainer = this.$menu.find('.'+this.Classes_.CONTAINER)
      let $items = this.$menuContainer.find('.' + this.Classes_.ITEM)
      this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this)
      this.boundItemClick_ = this.handleItemClick_.bind(this)

      for (let i = 0; i < $items.length; i++) {
        $($items[i]).on('click', this.boundItemClick_)
        $($items[i]).attr('tabindex', '-1')
        $($items[i]).on('keydown', this.boundItemKeydown_)
      }

      this.width = this.$menu.width()
      this.height = this.$menu.height()
      console.log(this)
      this.toggle()
      // follow
      /*if(typeof this.config.follow !== typeof undefined && this.config.follow != null ){
       this.boundFollowRightClick = this.handleFollowRightClick_.bind(this)
       $(this.config.follow).on('contextmenu', this.boundFollowRightClick)
       $(this.config.follow).on('taphold', this.boundFollowRightClick)
       }*/
    }

    MaterialMenu.prototype.handleForKeyboardEvent_ = function () {
    }

    MaterialMenu.prototype.handleItemKeyboardEvent_ = function () {
    }

    MaterialMenu.prototype.handleItemClick_ = function (e) {
      this.$menu.trigger('selected', ['l', 'value'])
      this.hide()
    }

    MaterialMenu.prototype.handleClickForBackDrop = function (e) {
      this.hide()
    }

    MaterialMenu.prototype.handleFollowRightClick_ = function (e) {
      if (e.which == 3) {
        e.preventDefault()
        this.setFollowPosition_(e)
      }
    }

    MaterialMenu.prototype.show = function () {
      let rect = this.$button.get(0).getBoundingClientRect()
      if (this.config.location != 'auto') {
        this.setPosition_(this.config.position)
      }

      this.setPosition_(this.config.position, rect)
      this.setLocation_(this.config.location, rect)

      if (!$('.' + this.Classes_.BACKDROP).length) {
        let menuBackDrop = $("<div></div>")
        menuBackDrop.addClass(this.Classes_.BACKDROP)
        $('body').prepend(menuBackDrop.get(0))
        menuBackDrop.on('click', this.handleClickForBackDrop.bind(this))
      }
      this.$menu.addClass(this.Classes_.IS_OPEN)
      this.$button.attr('aria-hidden', 'false')
    }

    MaterialMenu.prototype.hide = function () {
      this.$menu.addClass(this.Classes_.IS_LEAVING)
      window.setTimeout(function () {
        this.$menu.removeClass(this.Classes_.IS_OPEN).removeClass(this.Classes_.IS_LEAVING)
      }.bind(this), this.Constant_.CLOSE_TIMEOUT)
      $('.' + this.Classes_.BACKDROP).remove()
      this.$button.attr('aria-hidden', 'true')
    }

    MaterialMenu.prototype.toggle = function () {
      this.$menu.hasClass(this.Classes_.IS_OPEN) ? this.hide() : this.show()
    }

    MaterialMenu.prototype.setPosition_ = function (p, rect) {
      console.log(rect)

      let position = {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      }
      switch (p) {
        case 'bottom left':
          this.$menu.css('transform-origin', 'left bottom 0').css({
            'left': rect.left,
            'top': position.bottom - this.height,
            'right': 'auto',
            'bottom': 'auto'
          })
          break
        case 'bottom right':
          this.$menu.css('transform-origin', 'right bottom 0').css({
            'left': rect.right - this.width,
            'top': position.bottom - this.height,
            'right': 'auto',
            'bottom': 'auto'
          })
          break
        case 'top left':
          this.$menu.css('transform-origin', 'left top 0').css({
            'left': rect.left,
            'top': position.top,
            'right': 'auto',
            'bottom': 'auto'
          })
          break
        case 'center left':
          this.$menu.css('transform-origin', 'center center 0').css({
            'left': rect.left,
            'top': position.top - this.height / 2,
            'right': 'auto',
            'bottom': 'auto'
          })
          break
        case 'center right':
          this.$menu.css('transform-origin', 'center center 0').css({
            'left': rect.right - this.width,
            'top': position.top - this.height / 2,
            'right': 'auto',
            'bottom': 'auto'
          })
          break
        case 'center center':
          this.$menu.css('transform-origin', 'center center 0').css({
            'left': rect.left - this.width / 2,
            'top': position.top - this.height / 2,
            'right': 'auto',
            'bottom': 'auto'
          })
          break
        default:
          //top right
          this.$menu.css('transform-origin', 'right top 0').css('left', rect.left + rect.width - this.width).css('right', 'auto').css('bottom', 'auto').css('top', position.bottom - rect.height)
          break
      }
    }

    MaterialMenu.prototype.setLocation_ = function (l, rect) {
      if(rect === undefined)
          return
      let position = {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      }
      switch (l) {
        case 'bottom':
          this.$menu.css('top', position.bottom)
          break
        case 'auto':
          this.setAutoPosition_(position)
          break
      }
    }

    MaterialMenu.prototype.setAutoPosition_ = function (p) {
      let vertical = p.bottom + this.height
      let horizontal = p.right + this.width
      let windowWidth = $(window).width()
      let windowHeight = $(window).height()
      let atBottom = false
      let canVerticalCenter = false
      let canHorizontalCenter = false
      let atRight = false
      if (vertical > windowHeight) {
        atBottom = true
      }
      else {
        if (p.top - this.height / 2 > 0) {
          canVerticalCenter = true
        }
      }

      if (horizontal > windowWidth) {
        atRight = true
      }
      else {
        if (p.left - this.width / 2 > 0) {
          canHorizontalCenter = true
        }
      }
      switch (atBottom) {
        case true:
          atRight ? this.setPosition_(this.Constant_.BOTTOM_RIGHT, p) : this.setPosition_(this.Constant_.BOTTOM_LEFT, p)
          break
        case false:
          if (canVerticalCenter && this.config.location != 'follow') {
            canHorizontalCenter ? this.setPosition_(this.Constant_.CENTER_CENTER, p) : atRight ? this.setPosition_(this.Constant_.CENTER_RIGHT, p) : this.setPosition_(this.Constant_.CENTER_LEFT, p)
          } else {
            atRight ? this.setPosition_(this.Constant_.TOP_RIGHT, p) : this.setPosition_(this.Constant_.TOP_LEFT, p)
          }
          break
      }
    }

    MaterialMenu.prototype.setFollowPosition_ = function (e) {
      let customPosition = {
        top: e.clientY,
        bottom: e.clientY + 32,
        left: e.clientX,
        right: e.clientX + 32,
        height: 32,
        width: 32
      }
      this.setAutoPosition_(customPosition)
      this.toggle(e)
    }

    MaterialMenu.Plugin_ = function Plugin_(config, button) {
      return this.each(function () {
        let $this = $(this)
        let data = $this.data(DATA_KEY)
        if (!data) {
          $this.data(DATA_KEY, data = new MaterialMenu(this, config, button))
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"')
          }
          data[config]()
        }
      })
    }
    return MaterialMenu
  }()

  /**
   * -----------------------
   * Data Api
   * -----------------------
   */

  $(document).on('click', Selector.DATA_TOGGLE, function (e) {
    let $this = $(this)
    if (this.tagName === 'A') {
      e.preventDefault()
    }
    let target = $this.attr('data-target')
    if(typeof target === typeof undefined){
      throw new Error('Target MaterialMenu not specified.')
      return
    }
    let config = $(target).data(DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data())
    MaterialMenu.Plugin_.call($(target), config, this)
  })

  $.fn.MaterialMenu = MaterialMenu.Plugin_
  $.fn.MaterialMenu.Constructor = MaterialMenu
  $.fn.MaterialMenu.noConflict = function () {
    $.fn.MaterialMenu = MaterialMenu
    return MaterialMenu.Plugin_
  }
})(jQuery)