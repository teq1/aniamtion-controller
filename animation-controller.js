/**
 *
 * @date Â  Â 10/9/13 4:15 PM
 * @author  Wiktor Jamro <w.jamro@smartrecruiters.com>
 *
 */

/**
 * Animations controller
 */
var animationsSettings,
    smartAnimations = {
        _settings:{
            offset: 100
        },
        init: function(){
            animationsSettings = this._settings;
            this._getPages();
            this.triggerAnimation();
        },
        /**
         *
         * @private
         */
        _getPages: function(){
            if ( srPageAnimations.length ) {
                for ( var key in srPageAnimations){
                    if ( srPageAnimations.hasOwnProperty(key) ){
                        var page = srPageAnimations[key];
                        this._getSections(page);
                    }
                }
            }
        },
        /**
         *
         * @param page
         * @private
         */
        _getSections: function(page){
            var sections = page.sections;
            if (sections && sections.length){
                for (var key in sections){
                    if( sections.hasOwnProperty(key)){
                        var section = sections[key];
                        var id = "#" + section.name;
                        if ($(id).length){
                            var sectionInfo = this._getSectionInfo(section);
                            this._animate(sectionInfo);
                        }
                    }
                }
            }
        },
        //FIXME:remove undefined check
        /**
         * @param section
         * @private
         */
        _getSectionInfo: function(section){
            var id = "#" + section.name;
            var offset = (this.__ifExist(section.offset)) ? section.offset : animationsSettings.offset;
            var autoAnimate = (this.__ifExist(section.autoAnimate)) ? section.autoAnimate : undefined;
            var action = (this.__ifExist(section.action)) ? section.action : false;
            var ie9 = (this.__ifExist(section.IE9action)) ? section.IE9action : false;
            var customOnScroll = (action && this.__ifExist(section.action.onEnter)) ? section.action : false;
            var otherActions = (action && this.__ifExist(section.action.otherActions)) ? section.action.otherActions : false;
            return {
                id: id,
                min: $(id).position().top - offset,
                size: $(id).height(),
                autoAnimate: autoAnimate,
                action: action,
                ie9: ie9,
                customOnScroll: customOnScroll,
                otherActions: otherActions
            }
        },
        /**
         *
         * @param sectionInfo
         * @private
         */
        _animate: function(sectionInfo){
            var autoAnimate = this.__ifExist(sectionInfo.autoAnimate);
            if( !autoAnimate || autoAnimate && sectionInfo.autoAnimate ){
                if (!sectionInfo.action){
                    this._scrollspy(sectionInfo.id, sectionInfo.min, sectionInfo.size, this._addAnimateClass);
                } else {
                    var scrollAnimation = (!sectionInfo.customOnScroll) ? this._addAnimateClass : sectionInfo.customOnScroll;
                    this._scrollspy(sectionInfo.id, sectionInfo.min, sectionInfo.size, scrollAnimation);
                    if (!sectionInfo.otherActions){
                        //TODO Action
                    } else {
                        sectionInfo.action.otherActions(sectionInfo.id);
                    }
                }
            } else {
                sectionInfo.action.otherActions(sectionInfo.id);
            }
        },
        /**
         *
         * @param id
         * @param min
         * @param size
         * @param action
         * @private
         */
        _scrollspy: function(id, min, size, action){
            $(document).scrollspy({
                  min: min - 10,
                  max: min + size,
                  onEnter: function(element, position){
                      if (action.hasOwnProperty('onEnter')){
                          action.onEnter(id);
                      }
                  },
                  onLeave: function(element, position){
                      if (action.hasOwnProperty('onLeave')){
                          action.onLeave(id);
                      }
                  }
              });
        },
        /**
         *
         * @param elem
         * @returns {boolean}
         * @private
         */
        __ifExist: function(elem){
            return !!(elem);
        },
        _addAnimateClass: {
            onEnter: function(id){
                $(id).addClass("animate");
            }
        },
        /**
         *
         */
        triggerAnimation: function(){
            $('article [data-triggerAction]').on("click.triggerAction", function(){
                var id = $(this).data('triggeraction');
                $('#'+ id).toggleClass('animate');
            });
        }
    };

/**
 * Animation flow helper
 * @type {{setFlag: Function, getFlag: Function, resetFlag: Function, animationCounter: Function, resetCounter: Function}}
 */
srAnimationHelper = window.srAnimationHelper = {};
var animationHelper = {
    setFlag : function(id){
        srAnimationHelper[id] = {
            animateOnce : true
        }
    },
    getFlag : function(id){
        if (srAnimationHelper[id]){
            return false;
        } else {
            return srAnimationHelper[id].animateOnce;
        }
    },
    resetFlag : function(id){
        delete srAnimationHelper[id].animateOnce;
    },
    animationCounter : function(id){
        if (srAnimationHelper[id] && !srAnimationHelper[id].animationCounter){
            srAnimationHelper[id].animationCounter = 1;
        } else if (srAnimationHelper[id].animationCounter >= 0){
            srAnimationHelper[id].animationCounter += 1;
        }
    },
    resetCounter : function(id){
        delete srAnimationHelper[id].animationCounter;
    }
};

