var documenterSearchIndex = {"docs":
[{"location":"reference/#Reference","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/#Contents","page":"Reference","title":"Contents","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Pages = [\"reference.md\"]","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/#Index","page":"Reference","title":"Index","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Pages = [\"reference.md\"]","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Modules = [KnetNLPModels]","category":"page"},{"location":"reference/#KnetNLPModels.KnetNLPModel","page":"Reference","title":"KnetNLPModels.KnetNLPModel","text":"KnetNLPModel{T, S, C <: Chain} <: AbstractNLPModel{T, S}\n\nData structure that makes the interfaces between neural networks defined with Knet.jl and NLPModels. A KnetNLPModel has fields\n\nmeta and counters retain informations about the KnetNLPModel;\nchain is the chained structure representing the neural network;\ndata_train is the complete data training set;\ndata_test is the complete data test;\nsize_minibatch parametrizes the size of an training and test minibatches, which are of size 1/size_minibatch * length(ytrn) and 1/size_minibatch * length(ytst);\nminibatch_train is an iterator over an training minibatches;\nminibatch_test is an iterator over the test minibatches;\ncurrent_minibatch_training is the training minibatch used to evaluate the neural network;\ncurrent_minibatch_test is the current test minibatch, it is not used in practice;\nw is the vector of weights/variables;\nlayers_g is a nested array used for internal purposes;\nnested_array is a vector of Array{T,N}; its shape matches that of chain.\n\n\n\n\n\n","category":"type"},{"location":"reference/#KnetNLPModels.KnetNLPModel-Tuple{T} where T<:Chain","page":"Reference","title":"KnetNLPModels.KnetNLPModel","text":"KnetNLPModel(chain_ANN; size_minibatch=100, data_train=MLDatasets.MNIST.traindata(Float32), data_test=MLDatasets.MNIST.testdata(Float32))\n\nBuild a KnetNLPModel from the neural network represented by chain_ANN. chain_ANN is built using Knet.jl, see the tutorial for more details. The other data required are: an iterator over the training dataset data_train, an iterator over the test dataset data_test and the size of the minibatch size_minibatch. Suppose (xtrn,ytrn) = knetnlp.data_train, then the size of each training minibatch will be 1/size_minibatch * length(ytrn). By default, the other data are respectively set to the training dataset and test dataset of MLDatasets.MNIST, with each minibatch a hundredth of the dataset.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.accuracy-Tuple{AbstractKnetNLPModel}","page":"Reference","title":"KnetNLPModels.accuracy","text":"accuracy(nlp::AbstractKnetNLPModel)\n\nCompute the accuracy of the network nlp.chain given the data in nlp.minibatch_test. The computation of accuracy is based on the whole test dataset nlp.data_test.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.build_layer_from_vec!-Union{Tuple{N}, Tuple{T}, Tuple{AbstractArray{T, N}, AbstractVector{T}, Int64}} where {T<:Number, N}","page":"Reference","title":"KnetNLPModels.build_layer_from_vec!","text":"build_layer_from_vec!(array :: AbstractArray{T, N}, v :: AbstractVector{T}, index :: Int) where {T <: Number, N}\n\nInverse of the function Knet.cat1d; set array to the values of v in the range index+1:index+consumed_index.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.build_nested_array_from_vec!-Union{Tuple{S}, Tuple{T}, Tuple{AbstractKnetNLPModel{T, S}, AbstractVector{T}}} where {T, S}","page":"Reference","title":"KnetNLPModels.build_nested_array_from_vec!","text":"build_nested_array_from_vec!(model::AbstractKnetNLPModel{T,S}, new_w::AbstractVector{T}) where {T, S}\nbuild_nested_array_from_vec!(nested_array :: AbstractVector{<:AbstractArray{T,N} where {N}}, new_w :: AbstractVector{T}) where {T <: Number}\n\nBuild a vector of AbstractArray from new_w similar to Knet.params(model.chain) or nested_array. Call iteratively build_layer_from_vec! to build each intermediate AbstractArray. This method is not optimized; it allocates memory.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.build_nested_array_from_vec-Union{Tuple{S}, Tuple{T}, Tuple{AbstractKnetNLPModel{T, S}, AbstractVector{T}}} where {T<:Number, S}","page":"Reference","title":"KnetNLPModels.build_nested_array_from_vec","text":"nested_array = build_nested_array_from_vec(model::AbstractKnetNLPModel{T, S}, v::AbstractVector{T}) where {T <: Number, S}\nnested_array = build_nested_array_from_vec(chain_ANN::C, v::AbstractVector{T}) where {C <: Chain, T <: Number}\nnested_array = build_nested_array_from_vec(nested_array::AbstractVector{<:AbstractArray{T,N} where {N}}, v::AbstractVector{T}) where {T <: Number}\n\nBuild a vector of AbstractArray from v similar to Knet.params(model.chain), Knet.params(chain_ANN) or nested_array. Call iteratively build_layer_from_vec to build each intermediate AbstractArray. This method is not optimized; it allocates memory.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.create_minibatch-Tuple{Any, Any, Any}","page":"Reference","title":"KnetNLPModels.create_minibatch","text":"create_minibatch(X, Y, minibatch_size)\n\nCreate a minibatch's iterator of the data X, Y of size 1/minibatch_size * length(Y).\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.reset_minibatch_test!-Tuple{AbstractKnetNLPModel}","page":"Reference","title":"KnetNLPModels.reset_minibatch_test!","text":"reset_minibatch_test!(nlp::AbstractKnetNLPModel)\n\nSelect a new test minibatch for nlp.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.reset_minibatch_train!-Tuple{AbstractKnetNLPModel}","page":"Reference","title":"KnetNLPModels.reset_minibatch_train!","text":"reset_minibatch_train!(nlp::AbstractKnetNLPModel)\n\nSelect a new training minibatch for nlp. Typically used before a new evaluation of the loss function/gradient.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.set_size_minibatch!-Tuple{AbstractKnetNLPModel, Int64}","page":"Reference","title":"KnetNLPModels.set_size_minibatch!","text":"set_size_minibatch!(knetnlp::AbstractKnetNLPModel, size_minibatch::Int)\n\nChange the size of both training and test minibatches of the knetnlp. Suppose (xtrn,ytrn) = knetnlp.data_train, then the size of each training minibatch will be 1/size_minibatch * length(ytrn); the test minibatch follows the same logic. After a call of set_size_minibatch!, you must call reset_minibatch_train!(knetnlp) to use a minibatch of the expected size.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.set_vars!-Union{Tuple{T}, Tuple{AbstractVector{AutoGrad.Param}, AbstractVector{<:AbstractArray{T}}}} where T<:Number","page":"Reference","title":"KnetNLPModels.set_vars!","text":"set_vars!(model::AbstractKnetNLPModel{T,S}, new_w::AbstractVector{T}) where {T<:Number, S}\nset_vars!(chain_ANN :: C, nested_w :: AbstractVector{<:AbstractArray{T,N} where {N}}) where {C <: Chain, T <: Number}\nset_vars!(vars :: Vector{Param}, nested_w :: AbstractVector{<:AbstractArray{T,N} where {N}})\n\n)\n\nSet the variables of model (resp. chain_ANN and vars) to new_w (resp. nested_w). Build nested_w: a vector of AbstractArray from new_v similar to Knet.params(model.chain). Then, set the variables vars of the neural netword model (resp. chain_ANN) to new_w (resp. nested_w). set_vars!(model, new_w) allocates memory.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.vcat_arrays_vector-Tuple{AbstractVector{AutoGrad.Param}}","page":"Reference","title":"KnetNLPModels.vcat_arrays_vector","text":"vcat_arrays_vector(arrays_vector::AbstractVector{Param})\n\nFlatten a vector of arrays arrays_vector to a vector. It concatenates the vectors produced by the application of Knet.cat1d to each array.\n\n\n\n\n\n","category":"method"},{"location":"reference/#KnetNLPModels.vector_params-Tuple{C} where C<:Chain","page":"Reference","title":"KnetNLPModels.vector_params","text":"vector_params(chain :: C) where C <: Chain\nvector_params(nlp :: AbstractKnetNLPModel)\n\nRetrieve the variables within chain or nlp.chain as a vector.\n\n\n\n\n\n","category":"method"},{"location":"reference/#NLPModels.grad!-Union{Tuple{S}, Tuple{T}, Tuple{AbstractKnetNLPModel{T, S}, AbstractVector{T}, AbstractVector{T}}} where {T, S}","page":"Reference","title":"NLPModels.grad!","text":"g = grad!(nlp, x, g)\n\nEvaluate ∇f(x), the gradient of the objective function at x in place.\n\n\n\n\n\n","category":"method"},{"location":"reference/#NLPModels.obj-Union{Tuple{S}, Tuple{T}, Tuple{AbstractKnetNLPModel{T, S}, AbstractVector{T}}} where {T, S}","page":"Reference","title":"NLPModels.obj","text":"f = obj(nlp, x)\n\nEvaluate f(x), the objective function of nlp at x.\n\n\n\n\n\n","category":"method"},{"location":"#KnetNLPModels.jl","page":"Home","title":"KnetNLPModels.jl","text":"","category":"section"},{"location":"tutorial/#KnetNLPModels.jl-Tutorial","page":"Tutorial","title":"KnetNLPModels.jl Tutorial","text":"","category":"section"},{"location":"tutorial/#Synopsis","page":"Tutorial","title":"Synopsis","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"A KnetNLPModel gives the user access to:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"the values of the neural network variables/weights w;\nthe value of the objective/loss function L(X, Y; w) at w for a given minibatch (X,Y);\nthe gradient ∇L(X, Y; w) of the objective/loss function at w for a given mini-batch (X,Y).","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"In addition, it provides tools to:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"switch the minibatch used to evaluate the neural network;\nchange the minibatch size;\nmeasure the neural network's accuracy at the current w.","category":"page"},{"location":"tutorial/#Example","page":"Tutorial","title":"Example","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"This step-by-step example assume prior knowledge of julia and Knet.jl. See the Julia tutorial and the Knet.jl tutorial for more details.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"KnetNLPModels is an interface between Knet.jl's classification neural networks and NLPModels.jl.","category":"page"},{"location":"tutorial/#Preliminaries","page":"Tutorial","title":"Preliminaries","text":"","category":"section"},{"location":"tutorial/#Define-the-layers-of-interest","page":"Tutorial","title":"Define the layers of interest","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The following code defines a dense layer as a callable julia structure for use on a GPU via CUDA.jl:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"using Knet\n\nstruct Dense{T}\n  w :: Param{CuArray{Float32, 2, CUDA.Mem.DeviceBuffer}} # parameters of the layers\n  b :: Param{CuArray{Float32, 1, CUDA.Mem.DeviceBuffer}} # bias of the layer\n  f # activation function\nend\n(d :: Dense)(x) = d.f.(d.w * mat(x) .+ d.b) # evaluate the layer for a given input x\n\n# define a dense layer with input size i and output size o\nDense(i :: Int, o :: Int, f=sigm) = Dense(param(o, i), param0(o), f)","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"More layer types can be defined. Once again, see the Knet.jl tutorial for more details.","category":"page"},{"location":"tutorial/#Definition-of-the-chained-structure-that-evaluates-the-network-and-the-loss-function-(negative-log-likelihood)","page":"Tutorial","title":"Definition of the chained structure that evaluates the network and the loss function (negative log likelihood)","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"using KnetNLPModels\n\nstruct ChainNLL <: Chain # must derive from KnetNLPModels.Chain\n  layers\n  ChainNLL(layers...) = new(layers)\nend\n(c :: ChainNLL)(x) = (for l in c.layers; x = l(x); end; x) # evaluate the network for a given input x\n(c :: ChainNLL)(x, y) = Knet.nll(c(x), y) # compute the loss function given input x and expected output y\n(c :: ChainNLL)(data :: Tuple{T1,T2}) where {T1,T2} = c(first(data,2)...) # evaluate loss given data inputs (x,y)\n(c :: ChainNLL)(d :: Knet.Data) = Knet.nll(c; data=d, average=true) # evaluate loss using a minibatch iterator d","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The chained structure that defines the neural network must be a subtype of KnetNLPModels.Chain.","category":"page"},{"location":"tutorial/#Load-datasets-and-define-mini-batch","page":"Tutorial","title":"Load datasets and define mini-batch","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"In this example, we use the MNIST dataset from MLDatasets.jl.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"using MLDatasets\n\nxtrn, ytrn = MNIST.traindata(Float32) # MNIST training dataset\nytrn[ytrn.==0] .= 10 # re-arrange indices\nxtst, ytst = MNIST.testdata(Float32) # MNIST test dataset\nytst[ytst.==0] .= 10 # re-arrange indices\n\ndtrn = minibatch(xtrn, ytrn, 100; xsize=(size(xtrn, 1), size(xtrn, 2), 1, :)) # training mini-batch\ndtst = minibatch(xtst, ytst, 100; xsize=(size(xtst, 1), size(xtst, 2), 1, :)) # test mini-batch","category":"page"},{"location":"tutorial/#Definition-of-the-neural-network-and-KnetNLPModel","page":"Tutorial","title":"Definition of the neural network and KnetNLPModel","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The following code defines DenseNet, a neural network composed of 3 dense layers, embedded in a ChainNLL.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"DenseNet = ChainNLL(Dense(784, 200), Dense(200, 50), Dense(50, 10))","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"Next, we define the KnetNLPModel from the neural network. By default, the size of each minibatch is 1% of the corresponding dataset offered by MNIST.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"DenseNetNLPModel = _init_KnetNLPModel(DenseNet; size_minibatch=100, data_train=(xtrn, ytrn), data_test=(xtst, ytst))","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"DenseNetNLPModel will be either a KnetNLPModelCPU if the code runs on a CPU or a KnetNLPModelGPU if it runs on a GPU. All the methods are defined for both KnetNLPModelCPU and KnetNLPModelGPU.","category":"page"},{"location":"tutorial/#Tools-associated-to-a-KnetNLPModel","page":"Tutorial","title":"Tools associated to a KnetNLPModel","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The problem dimension n, where w ∈ ℝⁿ:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"n = DenseNetNLPModel.meta.nvar","category":"page"},{"location":"tutorial/#Get-the-current-network-weights:","page":"Tutorial","title":"Get the current network weights:","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"w = vector_params(DenseNetNLPModel)","category":"page"},{"location":"tutorial/#Evaluate-the-loss-function-(i.e.-the-objective-function)-at-w:","page":"Tutorial","title":"Evaluate the loss function (i.e. the objective function) at w:","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"NLPModels.obj(DenseNetNLPModel, w)","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The length of w must be DenseNetNLPModel.meta.nvar.","category":"page"},{"location":"tutorial/#Evaluate-the-gradient-at-w:","page":"Tutorial","title":"Evaluate the gradient at w:","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"NLPModels.grad!(DenseNetNLPModel, w, g)","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The result is stored in g :: Vector{T}, g is similar to v (of size DenseNetNLPModel.meta.nvar).","category":"page"},{"location":"tutorial/#Evaluate-the-network-accuracy:","page":"Tutorial","title":"Evaluate the network accuracy:","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The accuracy of the network can be evaluated with:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"accuracy(DenseNetNLPModel)","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"accuracy() uses the full training dataset. That way, the accuracy will not fluctuate with the minibatch.","category":"page"},{"location":"tutorial/#Default-behavior","page":"Tutorial","title":"Default behavior","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"By default, the training minibatch that evaluates the neural network doesn't change between evaluations. To change the training minibatch, use:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"reset_minibatch_train!(DenseNetNLPModel)","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The size of the new minibatch is the size define earlier.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The size of the training and test minibatch can be set to 1/p the size of the dataset with:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"set_size_minibatch!(DenseNetNLPModel, p) # p::Int > 1","category":"page"}]
}
