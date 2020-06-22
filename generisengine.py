import os 
import json 

import webapp2
import jinja2

from google.appengine.ext import db

template_dir = os.path.join(os.path.dirname(__file__), '')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)


def render_str(template, **params):
    t = jinja_env.get_template(template)
    return t.render(params) 

class BlogHandler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw) 

    def render_str(self, template, **params): 
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))

    def render_json(self, d):
        json_txt = json.dumps(d)
        self.response.headers['Content-Type'] = 'application/json; charset=UTF-8'
        self.write(json_txt) 

    def initialize(self, *a, **kw):
        webapp2.RequestHandler.initialize(self, *a, **kw) 
        if self.request.url.endswith('.json'):
            self.format = 'json'
        else:
            self.format = 'html'

class Publish(db.Model):
    userName = db.TextProperty(required = True)  
    userEmail = db.TextProperty(required = True)  
    accountHost = db.TextProperty(required = True)  
    gameName = db.TextProperty(required = True)  
    developer = db.TextProperty(required = True)  
    genres = db.TextProperty(required = True)  
    description = db.TextProperty(required = True)  
    screenshots = db.TextProperty(required = True)  
    trailers = db.TextProperty(required = True)  
    gameCode =  db.TextProperty(required = True)  
    gameRating = db.TextProperty(required = True)  
    gameViews = db.TextProperty(required = True)  
    raters = db.TextProperty(required = True)  
    viewers = db.TextProperty(required = True)  

    def as_dict(self): 
        curTime_fmt = '%c'
        d = { "userName": self.userName, 
              "userEmail": self.userEmail, 
              "accountHost": self.accountHost,
              "gameName": self.gameName, 
              "developer": self.developer, 
              "genres": self.genres,
              "description": self.description, 
              "screenshots": self.screenshots, 
              "trailers": self.trailers,
              "gameCode": self.gameCode,
              "gameRating": self.gameRating, 
              "raters": self.raters,
              "gameViews": self.gameViews,
              "viewers": self.viewers
            }
        return d

class Assets(db.Model):
    userName = db.TextProperty(required = True)  
    userEmail = db.TextProperty(required = True)  
    accountHost = db.TextProperty(required = True)  
    assetName = db.TextProperty(required = True)  
    tags = db.TextProperty(required = True)  
    description = db.TextProperty(required = True)  
    screenshots = db.TextProperty(required = True)  
    assets = db.TextProperty(required = True)
    assetRating = db.TextProperty(required = True)  
    assetViews = db.TextProperty(required = True)  
    raters = db.TextProperty(required = True)  
    viewers = db.TextProperty(required = True)  

    def as_dict(self): 
        curTime_fmt = '%c'
        d = { "userName": self.userName, 
              "userEmail": self.userEmail, 
              "accountHost": self.accountHost,
              "assetName": self.assetName, 
              "tags": self.tags,
              "description": self.description, 
              "screenshots": self.screenshots, 
              "assets": self.assets,
              "assetRating": self.assetRating, 
              "raters": self.raters,
              "assetViews": self.assetViews,
              "viewers": self.viewers
            }
        return d

class Tutorials(db.Model):
    userName = db.TextProperty(required = True)  
    userEmail = db.TextProperty(required = True)  
    accountHost = db.TextProperty(required = True)  
    tutorialtitle = db.TextProperty(required = True)  
    tags = db.TextProperty(required = True)  
    description = db.TextProperty(required = True)  
    screenshots = db.TextProperty(required = True)  
    tutorials = db.TextProperty(required = True)
    tutorialUrl = db.TextProperty(required = True)  
    tutorialRating = db.TextProperty(required = True)  
    tutorialViews = db.TextProperty(required = True)  
    raters = db.TextProperty(required = True)  
    viewers = db.TextProperty(required = True)  

    def as_dict(self): 
        curTime_fmt = '%c'
        d = { "userName": self.userName, 
              "userEmail": self.userEmail, 
              "accountHost": self.accountHost,
              "tutorialTitle": self.tutorialTitle, 
              "tags": self.tags,
              "description": self.description, 
              "screenshots": self.screenshots, 
              "tutorials": self.tutorials,
              "tutorialUrl": self.tutorialUrl, 
              "tutorialRating": self.tutorialRating, 
              "raters": self.raters,
              "tutorialViews": self.tutorialViews,
              "viewers": self.viewers
            }
        return d

class MainPage(BlogHandler): 
    def get(self):
        self.render('home.html') 

class GameEnginePage(BlogHandler): 
    def get(self):
        self.render('generis.html')  

class ShowcasePage(BlogHandler): 
    def get(self): 
        published = Publish.all() 

        gameId = self.request.get('gameId')

        if gameId:
            game_key = db.Key.from_path('Publish', gameId)
            game = db.get(game_key) 
            if game!=None:
                self.response.out.write(game.gameCode)

        else:
            games = [p.as_dict() for p in published] 
            if self.format == 'html':
                self.render('showcase.html', games = json.dumps(games))
            else:
                return self.render_json(games)
    
    def post(self): 
        key_name = self.request.get('key_name')
        check = self.request.get('check')
        if key_name:
            game_key = db.Key.from_path('Publish', key_name)
            game = db.get(game_key) 
            if game!=None:
                if(check!="True"):
                    print(check)
                    game.delete()
                return self.response.out.write(True)
            else:
                return self.response.out.write(False)
        else:
            gameId = self.request.get('gameId')
            userName = self.request.get('userName')
            userEmail = self.request.get('userEmail')
            accountHost = self.request.get('accountHost')
            gameName = self.request.get('gameName')
            developer = self.request.get('developer')
            genres = self.request.get('genres')
            description = self.request.get('description')
            screenshots = self.request.get('screenshots')
            trailers = self.request.get('trailers')
            gameCode = self.request.get('gameCode')
            gameUrl = self.request.get('gameUrl')
            gameRating = self.request.get('gameRating')
            raters = self.request.get('raters')
            gameViews = self.request.get('gameViews') 
            viewers = self.request.get('viewers') 

            game_key = db.Key.from_path('Publish', gameId)
            game = db.get(game_key)
            if game!=None:
                    game.delete()

            p = Publish( key_name=gameId, 
                         userName=userName, userEmail=userEmail, accountHost=accountHost,
                         gameName=gameName, developer=developer, genres=genres,
                         description=description, screenshots=screenshots, trailers=trailers,
                         gameCode=gameCode, gameUrl = gameUrl, gameRating = gameRating, 
                         raters = raters, gameViews = gameViews, viewers = viewers )   
            p.put()

class assets(BlogHandler): 
    def get(self): 
        Assetsall = Assets.all()
        Assets1 = [p.as_dict() for p in Assetsall] 
        if self.format == 'html':
            self.render('assetStore.html', assets = json.dumps(Assets1))
        else:
            return self.render_json(Assets1)
    
    def post(self): 
        key_name = self.request.get('key_name')
        check = self.request.get('check')
        if key_name:
            asset_key = db.Key.from_path('Assets', key_name)
            asset = db.get(asset_key) 
            print(asset)
            if asset!=None:
                if(check!="True"): 
                    asset.delete()
                return self.response.out.write(True)
            else:
                return self.response.out.write(False)
        else:
            assetId = self.request.get('assetId')
            userName = self.request.get('userName')
            userEmail = self.request.get('userEmail')
            accountHost = self.request.get('accountHost')
            assetName = self.request.get('assetName')
            tags = self.request.get('tags')
            description = self.request.get('description')
            screenshots = self.request.get('screenshots')
            assets = self.request.get('assets')
            assetRating = self.request.get('assetRating')
            raters = self.request.get('raters')
            assetViews = self.request.get('assetViews') 
            viewers = self.request.get('viewers') 

            asset_key = db.Key.from_path('Publish', assetId)
            asset = db.get(asset_key)  
            if asset!=None:
                    asset.delete()

            p = Assets( key_name=assetId, 
                        userName=userName, userEmail=userEmail, accountHost=accountHost,
                        assetName=assetName, tags=tags, description=description, 
                        screenshots=screenshots, assets=assets, assetRating = assetRating, 
                        raters = raters, assetViews = assetViews, viewers = viewers )   
            p.put()

class tutorials(BlogHandler): 
    def get(self): 
        Tutorialsall = Tutorials.all()
        Tutorials1 = [p.as_dict() for p in Tutorialsall] 
        if self.format == 'html':
            self.render('tutorials.html', tuts = json.dumps(Tutorials1))
        else:
            return self.render_json(Tutorials1)
    
    def post(self): 
        key_name = self.request.get('key_name')
        check = self.request.get('check')
        if key_name:
            tutorial_key = db.Key.from_path('Tutorials', key_name)
            tutorial = db.get(asset_key) 
            if tutorial!=None:
                if(check!="True"):
                    print(check)
                    tutorial.delete()
                return self.response.out.write(True)
            else:
                return self.response.out.write(False)
        else:
            tutorialId = self.request.get('tutorialId')
            userName = self.request.get('userName')
            userEmail = self.request.get('userEmail')
            accountHost = self.request.get('accountHost')
            tutorialTitle = self.request.get('tutorialTitle')
            tags = self.request.get('tags')
            description = self.request.get('description')
            screenshots = self.request.get('screenshots')
            tutorials = self.request.get('tutorials')
            tutorialRating = self.request.get('tutorialRating')
            raters = self.request.get('raters')
            tutorialViews = self.request.get('tutorialViews') 
            viewers = self.request.get('viewers') 

            tutorial_key = db.Key.from_path('Publish', tutorialId)
            tutorial = db.get(tutorial_key)  
            if tutorial!=None:
                    tutorial.delete()

            p = Tutorials( key_name=tutorialId, 
                            userName=userName, userEmail=userEmail, accountHost=accountHost,
                            tutorialTitle=tutorialTitle, tags=tags, description=description, 
                            screenshots=screenshots, tutorials=tutorial, tutorialRating = tutorialRating, 
                           raters = raters, tutorialViews = tutorialViews, viewers = viewers )   
            p.put()

class ForumPage(BlogHandler): 
    def get(self):
        self.render('forum.html')  


class docs(BlogHandler): 
    def get(self):
        self.render('docs.html') 

class manual(BlogHandler): 
    def get(self):
        self.render('manual2.html') 

class API1(BlogHandler): 
    def get(self):
        self.render('API1.html') 

class API2(BlogHandler): 
    def get(self):
        self.render('API2.html') 

class API3(BlogHandler): 
    def get(self):
        self.render('API3.html')  

class ClockTimer(db.Model):
    firstTime = db.StringProperty(default="0")
    curTime = db.StringProperty(default="0")
    status = db.StringProperty(default="stop")
    idt = db.StringProperty()

    @classmethod
    def getTime(cls, key_name):
        d = db.Key.from_path('ClockTimer', key_name)
        data = db.get(d)
        if data==None:
            data = ClockTimer.setTime(key_name, "1", "1", "stop")
        return data

    @classmethod
    def setTime(cls, key_name, firstTime, curTime, status): 
        return ClockTimer(key_name=key_name,
                    idt=key_name,
                    firstTime = firstTime,
                    curTime = curTime,
                    status = status)

class Clock1(BlogHandler): 
    
    def get(self):
        self.render('clock.html')


class Clock1Admin(BlogHandler): 
    def get(self):
        self.render('clockAdmin.html')
    def post(self):
        key_name = self.request.get('key')
        firstTime = self.request.get('firstTime')
        curTime = self.request.get('curTime')
        status = self.request.get('status') 
        get = self.request.get('get')  

        if get=="all":
            AClockTimer = ClockTimer.all()
            BClockTimer = [p.idt for p in AClockTimer] 
            self.response.out.write(json.dumps(BClockTimer))
        else:
            data = ClockTimer.getTime(key_name) 
            if get=="1":
                if data == None:
                    self.response.out.write(json.dumps([{"error":"error"}]))
                else:
                    self.response.out.write(json.dumps([{"firstTime":data.firstTime,"curTime":data.curTime,"status":data.status}]))
            else:
                #data = ClockTimer.setTime(firstTime, curTime, status)
                data.firstTime = firstTime
                data.curTime = curTime
                data.status = status
                data.put()

application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/engine', GameEnginePage),
    ('/showcase/?(?:.json)?', ShowcasePage),
    ('/tutorials/?(?:.json)?', tutorials),
    ('/assets/?(?:.json)?', assets),
    ('/forum', ForumPage),
    ('/docs', docs),
    ('/manual', manual),
    ('/API1', API1),
    ('/API2', API2),
    ('/API3', API3),
    ('/clock1', Clock1),
    ('/clock1Admin', Clock1Admin),
], debug=True)
