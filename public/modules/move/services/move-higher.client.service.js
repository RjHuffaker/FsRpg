'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('moveHigher', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            // if(!slot.left.overlap && !slot.right.overlap && !panel.left.overlap && !panel.right.overlap) return;
            
            console.log('moveHigher');
            
            CoreVars.setCardMoving();
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id),
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id),
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id),
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id);
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slotStart._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panelEnd._id);
            
            if(slotOrder < panelOrder){
                // Panel moving left <---
                
                PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                
            } else if(panelOrder < slotOrder){
                // Panel moving right --->
                
                PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                
                if(slotOrder - panelOrder > 1){
                    // Panel moving right more than one slot --->
                    PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                }
            }
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
            
        };
        
    }]);