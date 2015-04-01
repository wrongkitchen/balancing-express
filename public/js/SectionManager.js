var SectionManager;
var SectionBase;
var ReadyBase;
var GameBase;
var ResultBase;
var introBase;
(function($){

    // Section Manager
    SectionManager = Backbone.Model.extend({
        initialize: function(options){
            this.active = options.active;
            if(this.active == "intro") 
                this.get('sections')['intro'].startScene();
        },
        changeSection: function(pTargetSection, pCallback){
            var _this = this;
            var _sections = _this.get('sections');
            if(_sections[pTargetSection] && pTargetSection != _this.active){
                _sections[_this.active].fadeOut(function(){
                    _sections[pTargetSection].fadeIn(function(){
                        _this.active = pTargetSection;
                        if(pCallback) pCallback();
                    });
                });
            }
        }
    });

    // Section Base 
    SectionBase = Backbone.Model.extend({
        fadeOut: function(pCallback){
            var _this = this;
            var _el = _this.get('el');
            $(_el).fadeOut(function(){
                $(this).removeClass('active');
                if(pCallback) pCallback();
            });
        },
        fadeIn: function(pCallback){
            var _this = this;
            var _el = _this.get('el');
            $(_el).fadeIn(function(){
                $(this).addClass('active');
                if(pCallback) pCallback();
            });
        }
    });


    // Ready Base
    ReadyBase = SectionBase.extend({
        fadeIn: function(pCallback){
            var _this = this;
            var _el = _this.get('el');
            SectionBase.prototype.fadeIn.call(_this, function(){
                _el.find('.readyTxt').css({ top: "55px" });
                _el.find('.readyCountdown').show();
                _el.find('.readyBottom').css({ right: "0" });
                if(pCallback) pCallback();
            });
        },
        fadeOut: function(pCallback){
            var _this = this;
            var _el = _this.get('el');
            _el.find('.readyTxt').animate({ top: "-150px" });
            _el.find('.readyCountdown').fadeOut();
            _el.find('.readyBottom').animate({ right: "-609px" }, function(){
                _el.fadeOut(0, function(){
                    $(this).removeClass('active');
                    if(pCallback) pCallback();
                });
            });
        }
    });


    //Game Base
    GameBase = SectionBase.extend({
        fadeOut: function(pCallback){
            var _this = this;
            var _el = _this.get('el');
            _el.find('.mainTitle').animate({ top: "-150px" });
            _el.find('.gameCountdown').fadeOut(function(){
                _el.find('.content').animate({ right: "-811px" }, function(){
                    _el.fadeOut(0, function(){
                        $(this).removeClass('active');
                        if(pCallback) pCallback();
                    });
                });
            });
        },
        fadeIn: function(pCallback){
            var _this = this;
            var _el = _this.get('el');
            _el.fadeIn(function(){
                _el.find('.mainTitle').animate({ top: "55px" });
                _el.find('.content').animate({ right: "0px" }, function(){
                    _el.find('.gameCountdown').fadeIn();
                    _el.addClass('active');
                    if(pCallback) pCallback();
                });
            });
        }
    });

    // Result Base
    ResultBase = SectionBase.extend({
        fadeOut: function(pCallback){
            var _this = this;
            var _el = _this.get('el');
            _el.find('.scoreContain').animate({ top:"400px" });
            SectionBase.prototype.fadeOut.call(_this, pCallback);
        },
        fadeIn: function(pCallback){
            var _this = this;
            var _el = _this.get('el');
            _el.find('.scoreContain').animate({ top:"207px" });
            SectionBase.prototype.fadeIn.call(_this, pCallback);
        }
    });

    // introBase Base
    introBase = SectionBase.extend({
        sceneInterval: null,
        currentScene: 0,
        introAnimation: null,
        fadeOut: function(pCallback){
            var _el = this.get('el');
            this.endScene();
            SectionBase.prototype.fadeOut.call(this, function(){
                _el.removeClass('active_scene1 active_scene2 active_scene3 active_scene4').addClass('active_scene1');
                if(pCallback) pCallback();
            });
        },
        fadeIn: function(pCallback){
            this.startScene();
            SectionBase.prototype.fadeIn.call(this, pCallback);
        },
        startScene: function(){
            var _this = this;
            var _el = _this.get('el');
            _this.introAnimation = _this.startIntroAnimation();
            _this.sceneInterval = setInterval(function(){
                _el.removeClass('active_scene1 active_scene2 active_scene3 active_scene4');
                _el.addClass('active_scene' + ((_this.currentScene % $('.intro .scene').length) + 1));
                _this.currentScene += 1;
            }, 4000);
        },
        endScene: function(){
            clearInterval(this.sceneInterval);
            this.currentScene = 0;
        },
        startIntroAnimation: function(){
            var _this = this;
            var arrowCounter = 0;
            var arrowInterval = setInterval(function(){
                if(!_this.sceneAnimating){
                    arrowCounter += 1;
                    $('.arrowDown').removeClass('status1 status2 status3 status4 status5 status6 status7 status8 status9 status10').addClass('status' + ((arrowCounter % 10) + 1));
                    $('.animation').removeClass('status1 status2 status3 status4 status5 status6 status7 status8 status9 status10').addClass('status' + ((arrowCounter % 6) + 1));
                }
            }, 100);

            return arrowInterval;
        }
    });

})(jQuery);