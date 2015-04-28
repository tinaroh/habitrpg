'use strict';

describe('Challenges Controller', function() {
  var scope, ctrl, user, challenges, $rootScope;

  beforeEach(function() {
    module(function($provide) {
      $provide.value('User', {});
    });

    inject(function($rootScope, $controller, Challenges){
      user = specHelper.newUser();
      user._id = "unique-user-id";

      scope = $rootScope.$new();

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: {user: user}});

      ctrl = $controller('ChallengesCtrl', {$scope: scope, User: {user: user}});

      challenges = Challenges;
    });
  });

  describe("save challenge", function() {
    var alert;

    beforeEach(function(){
      alert = sinon.stub(window, "alert");
    });

    afterEach(function(){
      window.alert.restore();
    });

    it("opens an alert box if challenge.group is not specified", function() {
      // @TODO: change these to new real challenges using challenges constructor
      var chlg = {
        name: "Challenge without a group",
        leader: user._id
      };

      scope.save(chlg);
      expect(alert.callCount).to.to.eql(1);
      alert.should.have.been.calledWith(window.env.t('selectGroup'));
    });

    it("opens an alert box if isNew and user does not have enough gems", function() {
      var chlg = {
        name: "Challenge without enough gems",
        leader: user._id,
        group: "a-group-id"
      };

      scope.enoughGems = false;
      scope.save(chlg);

      expect(alert.callCount).to.to.eql(1);
      alert.should.have.been.calledWith(window.env.t('challengeNotEnoughGems'));
    });

    it("saves the challenge if user does not have enough gems, but the challenge is not new", function() {

      var chlg = {
        _id: "challenge-id",
        name: "Challenge that is not new",
        leader: user._id,
        group: "a-group-id",
        $save: function(cb) {
          cb();
        }
      };

      scope.enoughGems = false;
      scope.save(chlg);

      expect(chlg._locked).to.be.ok;

      // @TODO stub getChallenges and make sure it gets called
      // Made need to put getChallenges on $scope to do that
    });
  });
});
